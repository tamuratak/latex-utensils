import {bibtexParser, latexLogParser, latexParser} from '../main'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import * as process from 'process'
import {program} from 'commander'
import Tracer = require('pegjs-backtrace')


function deleteLocation(node: any) {
    if (!node) {
        return
    }
    if (node.hasOwnProperty('location')) {
        delete node.location
    }
    for (const key of Object.getOwnPropertyNames(node)) {
        const val = node[key]
        if (typeof val === 'object') {
            deleteLocation(val)
        }
    }
}

program
.option('-i, --inspect', 'use util.inspect to output AST')
.option('--color', 'turn on the color option of util.inspect')
.option('-l, --location', 'enable location')
.option('-c, --comment', 'enable comment')
.option('-s, --start-rule [rule]', 'set start rule. default is "Root".')
.option('-d, --debug', 'enable backtrace for debug')
.option('--timeout [timeout]', 'set tiemout in milliseconds')
.parse(process.argv)
const filename = program.args[0]
if (!fs.existsSync(filename)) {
    console.error(`${filename} not found.`)
    process.exit(1)
}
const opts = program.opts()
const s = fs.readFileSync(filename, {encoding: 'utf8'})
const startRule = opts.startRule || 'Root'
const ext = path.extname(filename)
let ret: latexParser.LatexAst | bibtexParser.BibtexAst | latexLogParser.LatexLogAst
const useColor = opts.color ? true : false
const tracer = opts.debug ? new Tracer(s, { showTrace: true, useColor, }) : undefined
const timeout = Number(opts.timeout)

try {
    if (ext === '.tex') {
        ret = latexParser.parse(
            s,
            {startRule, enableComment: opts.comment, tracer, timeout}
        )
        if (!opts.location) {
            deleteLocation(ret)
        }
    } else if (ext === '.bib') {
        ret = bibtexParser.parse(s, { tracer })
    } else if (ext === '.log') {
        ret = latexLogParser.parse(s, { tracer })
    } else {
        console.error('The suffix of the file is unknown.')
        process.exit(1)
    }
} catch (e) {
    if (latexParser.isSyntaxError(e)) {
        if (tracer) {
            console.log(tracer.getBacktraceString())
        }
        const loc = e.location
        console.error(`SyntaxError at line: ${loc.start.line}, column: ${loc.start.column}.`)
        console.error(e.message)
        process.exit(1)
    }
    throw e
}

if (opts.inspect) {
    const colors = opts.color
    console.log(util.inspect(ret, {showHidden: false, depth: null, colors}))
} else {
    console.log(JSON.stringify(ret, undefined, '  '))
}
