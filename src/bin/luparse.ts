import {bibtexParser, latexLogParser, latexParser} from '../main'
import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import * as process from 'process'
import * as commander from 'commander'

function deleteLocation(node: any) {
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

commander
.option('-i, --inspect', 'use util.inspect to output AST')
.option('--color', 'turn on the color option of util.inspect')
.option('-l, --location', 'enable location')
.option('-c, --comment', 'enable comment')
.option('-s, --start-rule [rule]', 'set start rule. default is "Root".')
.parse(process.argv)
const filename = commander.args[0]
if (!fs.existsSync(filename)) {
    console.error(`${filename} not found.`)
    process.exit(1)
}
const s = fs.readFileSync(filename, {encoding: 'utf8'})
const startRule = commander.startRule || 'Root'
const ext = path.extname(filename)
let ret: latexParser.LatexAst | bibtexParser.BibtexAst | latexLogParser.LatexLogAst
try {
    if (ext === '.tex') {
        ret = latexParser.parse(s, {startRule, enableComment: commander.comment})
        if (!commander.location) {
            deleteLocation(ret)
        }
    } else if (ext === '.bib') {
        ret = bibtexParser.parse(s)
    } else if (ext === '.log') {
        ret = latexLogParser.parse(s)
    } else {
        console.error('The suffix of the file is unknown.')
        process.exit(1)
        throw('')
    }
} catch (e) {
    if (latexParser.isSyntaxError(e)) {
        const loc = e.location
        console.error(`SyntaxError at line: ${loc.start.line}, column: ${loc.start.column}.`)
        console.error(e.message)
        process.exit(1)
    }
    throw e
}

if (commander.inspect) {
    const colors = commander.color
    console.log(util.inspect(ret, {showHidden: false, depth: null, colors}))
} else {
    console.log(JSON.stringify(ret, undefined, '  '))
}
