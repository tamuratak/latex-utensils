import * as assert from 'assert'
import {latexParser} from '../src/main'


suite('latexParser find', () => {
    suite('findAll', () => {
        test('test latexParser.findAll', () => {
            const tex = '\\newcommand{\\ABC}{ABC}'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.findAll(doc.content, latexParser.isCommand).length, 2)
            assert.strictEqual(latexParser.findAll(doc.content, latexParser.isTextString).length, 1)
            assert.strictEqual(latexParser.findAll(doc.content).length, 5)

            assert.deepStrictEqual(
                latexParser
                .findAll(doc.content, latexParser.isCommand)
                .map(result => result.node.name)
                .sort(),
                ['ABC', 'newcommand']
            )
        })
    })

    suite('pattern', () => {
        test('test latexParser.pattern', () => {
            const tex = '\\newcommand{\\ABC}{ABC}'
            const doc = latexParser.parse(tex)
            const pat = latexParser.pattern(latexParser.isCommand).child(latexParser.isGroup)
            console.log(pat.match(doc.content))
            assert.strictEqual(
                pat.match(doc.content).length,
                2
            )
        })
    })
})
