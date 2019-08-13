import * as assert from 'assert'
import {latexLogParser} from '../src/main'
import * as fs from 'fs'
import * as path from 'path'
// import {equalOnlyOnExpectedOwnedProperties} from './assert_partially'

suite('latexLogParser', () => {

    test('parse LaTeX log files', () => {
        const files = ['e01', 'e02', 'e03', 'e04', 'e05', 'e06']
        for (const name of files) {
            const fname = path.join('test', 'latex_log', name + '.log')
            const s = fs.readFileSync(fname, {encoding: 'utf8'})
            const ret = latexLogParser.parse(s)
            assert.strictEqual(ret.kind, 'full')
        }
    })

    test('parse LaTeX log files generated with -halt-on-error', () => {
        const files = ['h01', 'h02', 'h03', 'h04', 'h05', 'h06']
        for (const name of files) {
            const fname = path.join('test', 'latex_log', name + '.log')
            const s = fs.readFileSync(fname, {encoding: 'utf8'})
            const ret = latexLogParser.parse(s)
            assert.strictEqual(ret.kind, 'halt_on_error')
        }
    })

})
