import * as assert from 'assert'
import {assertType, TypeEq} from 'typepark'
import {latexParser as lp} from '../src/main'


suite('latexParser matchers', () => {
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

    suite('findAllSeqences', () => {
        test('test latexParser.findAllSeqences', () => {
            const tex = '{A B C}'
            const doc = lp.parse(tex)
            const ret = lp.findAllSequences(doc.content, [lp.isTextString])
            assert.strictEqual(ret.length, 3)
            const ret2 = lp.findAllSequences(doc.content, [
                (node) => lp.isTextString(node) && node.content === 'A',
                (node) => lp.isTextString(node) && node.content === 'B',
            ])
            assert.strictEqual(ret2.length, 1)
            const ret3 = lp.findAllSequences(doc.content, [
                (node) => lp.isTextString(node) && node.content === 'C',
                (node) => lp.isTextString(node) && node.content === 'A',
            ])
            assert.strictEqual(ret3.length, 0)
        })
    })

    suite('pattern', () => {
        test('test latexParser.pattern', () => {
            const tex = '\\newcommand{\\ABC}{ABC}'
            const doc = lp.parse(tex)
            assert.strictEqual(
                lp.pattern(lp.isCommand)
                .child(lp.isGroup)
                .matchAll(doc.content).length,
                2
            )
            assert.strictEqual(
                lp.pattern(lp.isCommand)
                .child(lp.isGroup)
                .child(lp.isTextString)
                .matchAll(doc.content).length,
                1
            )
        })

        test('test latexParser.pattern.match', () => {
            const tex = '\\newcommand{\\ABC}{ABC}'
            const doc = lp.parse(tex)
            const results = lp.pattern(lp.isCommand)
                          .child(lp.isGroup)
                          .child(lp.isTextString)
                          .matchAll(doc.content)
            for (const ret of results) {
                assert.strictEqual(
                    ret.parent.parent.parent,
                    undefined
                )
                assert.strictEqual(
                    ret.node.content,
                    'ABC'
                )
                assertType<TypeEq<typeof ret.parent.node, lp.Group>>()
            }
        })

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
                .matchAll(doc.content).length,
                0
            )
            assert.strictEqual(
                lp.pattern(lp.isCommand)
                .child(lp.isGroup)
                .matchAll(doc.content, { traverseAll: true }).length,
                2
            )
        })

        test('test latexParser.findNodeAt', () => {
            const tex = '{}'
            const doc = lp.parse(tex)
            assert.ok(!lp.findNodeAt(doc.content, {offset: 0}))
            assert.ok( lp.findNodeAt(doc.content, {offset: 1}))
            assert.ok(!lp.findNodeAt(doc.content, {offset: 2}))
        })

        test('test latexParser.findNodeAt with line and column', () => {
            const tex =
`
{}
`
            const doc = lp.parse(tex)
            assert.ok(!lp.findNodeAt(doc.content, { line: 1, column: 2 }))
            assert.ok(!lp.findNodeAt(doc.content, { line: 2, column: 1 }))
            assert.ok( lp.findNodeAt(doc.content, { line: 2, column: 2 }))
            assert.ok(!lp.findNodeAt(doc.content, { line: 2, column: 3 }))
            assert.ok(!lp.findNodeAt(doc.content, { line: 3, column: 2 }))
        })
        test('test latexParser.findNodeAt with line and column for multiple lines', () => {
            const tex =
`
 {
    
 }
`
            const doc = lp.parse(tex)
            assert.ok(!lp.findNodeAt(doc.content, { line: 1, column: 2 }))
            assert.ok(!lp.findNodeAt(doc.content, { line: 2, column: 2 }))
            assert.ok( lp.findNodeAt(doc.content, { line: 2, column: 3 }))
            assert.ok( lp.findNodeAt(doc.content, { line: 3, column: 1 }))
            assert.ok( lp.findNodeAt(doc.content, { line: 4, column: 2 }))
            assert.ok(!lp.findNodeAt(doc.content, { line: 4, column: 3 }))
        })
    })

    suite('type', () => {
        type KeyOfUnion<T> = T extends any ? keyof T : never
        type KeyWithNoneNodeValue = Exclude<KeyOfUnion<lp.Node>, 'content' | 'args' | 'arg'>
        type ValueType<T, C = any> = T extends lp.Node ? T[Extract<keyof T, C>] : never
        type NoneNodeType = ValueType<lp.Node, KeyWithNoneNodeValue>

        test('test that properties having a Node-related-type value are only content, args, and arg.', () => {
            assertType<TypeEq<NoneNodeType, undefined | string | lp.Location>>()
        })

        test('test the types of content, arg, and args.', () => {
            assertType< ValueType<lp.Node, 'content'> extends string | lp.Node[] ? true : false >()
            assertType< ValueType<lp.Node, 'arg'> extends undefined | lp.Node ? true : false >()
            assertType< ValueType<lp.Node, 'args'> extends lp.Node[] ? true : false >()
        })
    })

})
