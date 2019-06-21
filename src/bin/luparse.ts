import * as parser from '../latex_parser'
import * as fs from 'fs'

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
.option('-l, --location', 'enable location')
.option('-c, --comment', 'enable comment')
.option('-s, --start-rule [rule]', 'set start rule. default is "root".')
.parse(process.argv)
const filename = commander.args[0]
const s = fs.readFileSync(filename, {encoding: 'utf8'})
const startRule = commander.startRule || 'root'
const ret = parser.parse(s, {startRule, enableComment: commander.comment})

if (!commander.location) {
    deleteLocation(ret)
}

console.log(JSON.stringify(ret, undefined, '  '))
