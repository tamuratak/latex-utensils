import * as assert from 'assert'
import {latexParser as lp} from '../src/main'


suite('latexParser find', () => {
    suite('findAll', () => {
        test('test latexParser.findAll', () => {
            const tex = '\\newcommand{\\ABC}{ABC}'
            const doc = lp.parse(tex)
            assert.strictEqual(lp.findAll(doc.content, lp.isCommand).length, 2)
            assert.strictEqual(lp.findAll(doc.content, lp.isTextString).length, 1)
            assert.strictEqual(lp.findAll(doc.content).length, 5)

            assert.deepStrictEqual(
                lp
                .findAll(doc.content, lp.isCommand)
                .map(result => result.node.name)
                .sort(),
                ['ABC', 'newcommand']
            )
        })
    })

    suite('pattern', () => {
        test('test latexParser.pattern', () => {
            const tex = '\\newcommand{\\ABC}{ABC}'
            const doc = lp.parse(tex)
            assert.strictEqual(
                lp.pattern(lp.isCommand)
                .child(lp.isGroup)
                .match(doc.content).length,
                2
            )
            assert.strictEqual(
                lp.pattern(lp.isCommand)
                .child(lp.isGroup)
                .child(lp.isTextString)
                .match(doc.content).length,
                1
            )
        })
    })

    suite('pattern', () => {
        test('test latexParser.pattern', () => {
            const tex =
`
\\begin{document}
\\newcommand{\\ABC}{ABC}
\\end{document}
`
            const doc = lp.parse(tex)
            assert.strictEqual(
                lp.pattern(lp.isCommand)
                .child(lp.isGroup)
                .match(doc.content).length,
                0
            )
            assert.strictEqual(
                lp.pattern(lp.isCommand)
                .child(lp.isGroup)
                .match(doc.content, { traverseAll: true }).length,
                2
            )
        })
    })
})
