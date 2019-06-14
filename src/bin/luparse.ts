import * as parser from '../latex_parser'
import * as fs from 'fs'
import * as util from 'util'

const filename = process.argv[2]
const s = fs.readFileSync(filename, {encoding: 'utf8'})
const ret = parser.parse(s)
console.log(util.inspect(ret, {showHidden: false, depth: null}))