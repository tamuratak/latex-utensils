import * as assert from 'assert'
import {latexParser} from '../src/main'
import {equalOnlyOnExpectedOwnedProperties} from './assert_partially'


suite('latexParser', () => {

    suite('parse', () => {
        test('parse \\begin{center}...', () => {
            const tex = `
\\begin{center}
lmn
\\end{center}
            `
            const doc = latexParser.parse(tex)
            const expected: any = {
                content: [ {
                    kind: 'env',
                    content: [ {
                        kind: 'text.string',
                        content: 'lmn',
                        location: { start: {line: 3, column: 1}, end: {line: 3, column: 4} }
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse $1$', () => {
            const tex = '$1$'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'inlineMath',
                    content: [ {
                        kind: 'math.character',
                        content: '1'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\verb|1|', () => {
            const tex = '\\verb|1|'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'verb',
                    content: '1'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{verbatim}...', () => {
            const tex = '\\begin{verbatim}1\\end{verbatim}'
            const doc = latexParser.parse(tex)
            const expected: any = {
                content: [ {
                    kind: 'env.verbatim',
                    content: '1'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{minted}...', () => {
            const tex = '\\begin{minted}[abc]{xxx}1\\end{minted}'
            const doc = latexParser.parse(tex)
            const expected: any = {
                content: [ {
                    kind: 'env.minted',
                    content: '1'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
            assert.strictEqual(latexParser.stringify(doc.content), tex)
        })

        test('parse \\begin{lstlisting}...', () => {
            const tex = '\\begin{lstlisting}[caption=hoge,label=fuga]1\\end{lstlisting}'
            const doc = latexParser.parse(tex)
            const expected: any = {
                content: [ {
                    kind: 'env.lstlisting',
                    content: '1'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{align}...', () => {
            const tex = '\\begin{align}\n 1 \n\\end{align}'
            const doc = latexParser.parse(tex)
            const expected: any = {
                content: [ {
                    kind: 'env.math.align',
                    content: [ {
                        kind: 'math.character'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse newenvironment command', () => {
            const tex = `
\\newenvironment{newabc}
{\\begin{abc}}
{\\end{abc}}
            `
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command',
                    name: 'newenvironment',
                    args: [ {kind: 'arg.group'}, {kind: 'arg.group'}, {kind: 'arg.group'} ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\node[label={abc}, efg]', () => {
            const tex = '\\node[label={abc}, efg]'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command',
                    name: 'node',
                    args: [ {
                        kind: 'arg.optional'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\def\\abc{abc}', () => {
            const tex = '\\def\\abc{abc}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command.def',
                    token: '\\abc',
                    args: [ {
                        kind: 'arg.group'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\def\\abc [#1]#2 {#2#1abc}', () => {
            const tex = '\\def\\abc [#1]#2 {#2#1abc}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command.def',
                    token: '\\abc',
                    args: [{
                        kind: 'arg.optional'
                    }, {
                        kind: 'commandParameter'
                    }, {
                        kind: 'arg.group'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse a command whose name has @', () => {
            const tex = '\\a@c{abc}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command',
                    name: 'a@c',
                    args: [ {
                        kind: 'arg.group',
                        content: [ {
                            kind: 'text.string',
                            content: 'abc'
                        } ]
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse invalid commands without error', () => {
            const tex = '\\begin{abc}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command',
                    name: 'begin',
                    args: [ {
                        kind: 'arg.group',
                        content: [ {
                            kind: 'text.string',
                            content: 'abc'
                        } ]
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\part', () => {
            const tex = '\\part'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command',
                    name: 'part'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\par\\par', () => {
            const tex = '\\par\\par\\part\\par'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [
                    {
                        kind: 'parbreak'
                    },
                    {
                        kind: 'command',
                        name: 'part'
                    },
                    {
                        kind: 'parbreak'
                    }
                ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\label{a_b}', () => {
            const tex = '\\label{a_b}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command',
                    name: 'label',
                    args: [ {
                        kind: 'arg.group',
                        content: [ {
                            kind: 'text.string',
                            content: 'a_b'
                        } ]
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse a_b', () => {
            const tex = 'a_b'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [
                    { kind: 'text.string' },
                    { kind: 'subscript', content: [] },
                    { kind: 'text.string' }
                ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse a^b', () => {
            const tex = 'a^b'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [
                    { kind: 'text.string' },
                    { kind: 'superscript', content: [] },
                    { kind: 'text.string' }
                ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse ~', () => {
            const tex = '~'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ { kind: 'activeCharacter' } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('should throw SyntaxError', () => {
            const invalidTexts = [ '{', '$', '$$' ]
            for (const tex of invalidTexts) {
                assert.throws(
                    () => {
                        latexParser.parse(tex)
                    },
                    (e: any) => {
                        return e && latexParser.isSyntaxError(e)
                    },
                    `parsing ${tex}`
                )
            }
        })

        test('parse $ a ^ b $', () => {
            const tex = '$ a ^ b $'
            const root = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'inlineMath',
                    content: [
                        { kind: 'math.character', content: 'a'},
                        {
                            kind: 'superscript',
                            content: { kind: 'math.character', content: 'b' }
                        }
                    ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(root, expected)
        })

        test('parse $\\left(1\\right]$', () => {
            const tex = '$\\left(1\\right]$'
            const root = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'inlineMath',
                    content: [ {
                        kind: 'math.matching_paren',
                        left: '(',
                        right: ']',
                        content: [ {
                            kind: 'math.character',
                            content: '1'
                        } ]
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(root, expected)
        })

        test('parse { }, including only spaces', () => {
            const tex = '{ }'
            const root = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'arg.group',
                    content: []
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(root, expected)
        })

        test('parse $ $, including only spaces', () => {
            const tex = '$ $'
            const root = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'inlineMath',
                    content: []
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(root, expected)
        })

        test('parse \\( \\)', () => {
            const tex = '\\( \\)'
            const root = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'inlineMath',
                    content: []
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(root, expected)
        })

        test('parse \\[ \\]', () => {
            const tex = '\\[ \\]'
            const root = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'displayMath',
                    content: []
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(root, expected)
        })

        test('parse $$ $$', () => {
            const tex = '$$ $$'
            const root = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'displayMath',
                    content: []
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(root, expected)
        })

        test('parse \\begin{align} \\end{align}', () => {
            const tex = '\\begin{align} \\end{align}'
            const doc = latexParser.parse(tex)
            const expected: any = {
                content: [ {
                    kind: 'env.math.align',
                    content: []
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{align} \\begin{aligned} \\end{aligned} \\end{align}', () => {
            const tex = '\\begin{align} \\begin{aligned} \\end{aligned} \\end{align}'
            const doc = latexParser.parse(tex)
            const expected: any = {
                content: [ {
                    kind: 'env.math.align',
                    content: [ {
                        kind: 'env.math.aligned'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse preamble', () => {
            const tex = '\\newcommand{\\ABC}{ABC} \\begin{document} \\end{document}'
            const doc = latexParser.parsePreamble(tex)
            const expected: any = {
                kind: 'ast.preamble',
                rest: '\\begin{document} \\end{document}',
                content: [ {
                    kind: 'command',
                    name: 'newcommand',
                    args: [ {kind: 'arg.group'}, {kind: 'arg.group'}]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse empty preamble', () => {
            const tex = '\\begin{document} \\end{document}'
            const doc = latexParser.parse(tex, {startRule: 'Preamble'})
            const expected: any = {
                kind: 'ast.preamble',
                rest: '\\begin{document} \\end{document}',
                content: []
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })
    })

    suite('stringify', () => {
        test('test latexParser.stringify', () => {
            const tex = '\\newcommand{\\ABC}{ABC}'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), tex)
        })

        test('test latexParser.stringify', () => {
            const tex = '\\newcommand{\\cmark}[1][Green]{\\textcolor{#1!60!text}{\\ding{51}}}'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), tex)
        })

        test('test latexParser.stringify', () => {
            const tex = `
\\newcommand{\\topic}[1]{%
    \\needspace{5\\baselineskip}%
    \\begin{center} {\\itshape #1} \\end{center}%
}`
            const doc = latexParser.parse(tex)
            const expected = '\\newcommand{\\topic}[1]{\\needspace{5\\baselineskip}\\begin{center}{\\itshape #1}\\end{center}}'
            assert.strictEqual(latexParser.stringify(doc.content, { lineBreak : '' }), expected)
        })

        test('test latexParser.stringify with lineBreak', () => {
            const tex = '\\begin{align} a \\\\ b \\end{align}'
            const actualTeX = '\\begin{align}\na\\\\ b\n\\end{align}\n'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content, { lineBreak : '\n' }), actualTeX)
        })

        test('test stringify a_b', () => {
            const tex = 'a_b'
            const actualTeX = 'a_b'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), actualTeX)
        })

        test('test stringify \\def\\abc [#1]#2 {#2#1abc}', () => {
            const tex = '\\def\\abc [#1]#2 {#2#1abc}'
            const actualTeX = '\\def\\abc[#1]#2{#2#1abc}'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), actualTeX)
        })
    })

    suite('other', () => {
        test('test type guard', () => {
            return [
            (node: latexParser.Node): string | latexParser.Node[] => {
                if (latexParser.hasContent(node)) {
                    return node.content
                }
                return ''
            },
            (node: latexParser.Node): latexParser.Node[] => {
                if (latexParser.hasContentArray(node)) {
                    return node.content
                }
                return []
            },
            (node: latexParser.Node): latexParser.Node[] => {
                if (latexParser.hasArgsArray(node)) {
                    return node.args
                }
                return []
            },
            (node: latexParser.Node): string => {
                if (latexParser.hasContent(node) && !latexParser.hasContentArray(node)) {
                    return node.content
                }
                return ''
            }]
        })

        type NotHaveContent = latexParser.Command | latexParser.AmsMathTextCommand | latexParser.DefCommand | latexParser.Parbreak | latexParser.AlignmentTab | latexParser.CommandParameter | latexParser.ActiveCharacter | latexParser.Ignore

        test('test type guard with assingment and never type', () => {
            return (node: latexParser.Node) => {
                if (!latexParser.hasContent(node)) {
                    const dummy: NotHaveContent = node
                    const dummyWithoutContent: typeof node = dummy
                    return dummyWithoutContent
                }
                return
            }
        })
    })

})

