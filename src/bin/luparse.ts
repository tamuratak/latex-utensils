import * as parser from '../latex_parser'
import * as fs from 'fs'
import * as util from 'util'

function deleteLocation(node: any) {
    if (node.hasOwnProperty('location')) {
        delete node.location
    }
    for(const key of Object.getOwnPropertyNames(node)) {
        const val = node[key]
        if (typeof val === 'object') {
            deleteLocation(val)
        }
    }
}

const argv = require('yargs').boolean('disable-location').argv
const filename = argv._[0]
console.log(filename)
const s = fs.readFileSync(filename, {encoding: 'utf8'})
const ret = parser.parse(s)

if (argv['disable-location']) {
    deleteLocation(ret)
}

console.log(util.inspect(ret, {showHidden: false, depth: null}))
