import * as assert from 'assert'
import {latexParser} from '../src/main'
import {equalOnlyOnExpectedOwnedProperties} from './assert_partially'


suite('latexParser', () => {

    suite('parse', () => {
        test('parse \\begin{center}...', () => {
            const tex =
`\\begin{center}
lmn
\\end{center}`
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env',
                    content: [ {
                        kind: 'text.string',
                        content: 'lmn',
                        location: { start: {line: 2, column: 1}, end: {line: 2, column: 4} }
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{center} \\begin{itemize}', () => {
            const tex =
`\\begin {center}
\\begin {itemize}
   
\\end   {itemize}
\\end {center}`
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env',
                    content: [ {
                        kind: 'env'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse unbalanced \\begin', () => {
            const tex =
`\\begin{center}
\\begin{itemize}
\\end{center}`
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env',
                    name: 'center',
                    content: [ {
                        kind: 'command',
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse unbalanced \\end', () => {
            const tex =
`\\begin{center}
\\end{itemize}
\\end{center}`
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ { kind: 'command' }, {kind: 'softbreak'}, { kind: 'command' }, {kind: 'softbreak'}, { kind: 'command' } ]
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

        test('parse \\url', () => {
            const tex = '\\url{https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command.url',
                    name: 'url',
                    url: 'https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\url', () => {
            const tex = '\\url{ https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83 {}}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command.url',
                    name: 'url',
                    url: ' https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83 {}'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\href', () => {
            const tex = '\\href{https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83}{link}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command.href',
                    name: 'href',
                    url: 'https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\href', () => {
            const tex = '\\href{ https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83{} }{link}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command.href',
                    name: 'href',
                    url: ' https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83{} '
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
                    name: 'verb',
                    content: '1'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\verb*|1|', () => {
            const tex = '\\verb*|1|'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'verb',
                    name: 'verb*',
                    content: '1'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{verbatim}...', () => {
            const tex = '\\begin{verbatim}1\\end{verbatim}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env.verbatim',
                    name: 'verbatim',
                    content: '1'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{verbatim*}...', () => {
            const tex = '\\begin{verbatim*}1\\end{verbatim*}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env.verbatim',
                    name: 'verbatim*',
                    content: '1'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{minted}...', () => {
            const tex = '\\begin{minted}[abc]{xxx}1\\end{minted}'
            const doc = latexParser.parse(tex)
            const expected = {
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
            const expected = {
                content: [ {
                    kind: 'env.lstlisting',
                    content: '1'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse comments', () => {
            const tex = `
\\documentclass{article}

%comment1

\\begin{document}

\\section{A} %comment2
%comment3

Some sentences.

\\end{document}
`
            const doc = latexParser.parse(tex, {enableComment: true})
            const expected = {
                comment: [
                    {
                        kind: 'comment',
                        content: 'comment1'
                    },
                    {
                        kind: 'comment',
                        content: 'comment2'
                    },
                    {
                        kind: 'comment',
                        content: 'comment3'
                    }
                ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{align}...', () => {
            const tex = '\\begin{align}\n 1 \n\\end{align}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env.math.align',
                    content: [ {
                        kind: 'math.character'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse unbalanced \\begin{aligned}', () => {
            const tex =
`\\begin{align}
\\begin{aligned}
\\end{align}`

            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env.math.align',
                    content: [ {
                        kind: 'command'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse newenvironment command', () => {
            const tex =
`\\newenvironment{newabc}
{\\begin{abc}}
{\\end{abc}}`
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

        test('parse an optional argument having only spaces', () => {
            const tex = '\\newcommand{\\Hi}[1][ ]{Hi}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command',
                    name: 'newcommand',
                    args: [ {kind: 'arg.group'}, {kind: 'arg.optional'}, {kind: 'arg.optional'}, {kind: 'arg.group'} ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse optional arguments having spaces', () => {
            const tex = '\\newcommand{\\Hi}[ 1 2 3 ][ ]{Hi}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'command',
                    name: 'newcommand',
                    args: [ {kind: 'arg.group'}, {kind: 'arg.optional'}, {kind: 'arg.optional'}, {kind: 'arg.group'} ]
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

        test('parse \\newlineMyCommand', () => {
            const tex = '\\newlineMyCommand'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [
                    {
                        kind: 'command',
                        name: 'newlineMyCommand'
                    }
                ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\linebreakMyCommand', () => {
            const tex = '\\linebreakMyCommand'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [
                    {
                        kind: 'command',
                        name: 'linebreakMyCommand'
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
                    kind: 'command.label',
                    name: 'label',
                    label: 'a_b'
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
                    { kind: 'subscript', arg: undefined },
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
                    { kind: 'superscript', arg: undefined },
                    { kind: 'text.string' }
                ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })


        test('parse $a^b$', () => {
            const tex = '$a^b$'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'inlineMath',
                    content: [ {
                        kind: 'math.character',
                        content: 'a'
                    }, {
                        kind: 'superscript',
                        arg: {
                            kind: 'math.character',
                            content: 'b'
                        }
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse $a^b$ with {enableMathCharacterLocation: true}', () => {
            const tex = '$a^b$'
            const doc = latexParser.parse(tex, {enableMathCharacterLocation: true})
            const expected = {
                content: [ {
                    kind: 'inlineMath',
                    content: [ {
                        kind: 'math.character',
                        content: 'a',
                        location: {
                            end: {
                                column: 3,
                                line: 1,
                                offset: 2
                            },
                            start: {
                                column: 2,
                                line: 1,
                                offset: 1
                            }
                        }
                    }, {
                        kind: 'superscript',
                        arg: {
                            kind: 'math.character',
                            content: 'b'
                        }
                    } ]
                } ]
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
                            arg: { kind: 'math.character', content: 'b' }
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
                        kind: 'math.matching_delimiters',
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

        test('parse $\\left.1\\right]$', () => {
            const tex = '$\\left.1\\right]$'
            const root = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'inlineMath',
                    content: [ {
                        kind: 'math.matching_delimiters',
                        left: '.',
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
                    content: [ { kind: 'space' }]
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
            const expected = {
                content: [ {
                    kind: 'env.math.align',
                    content: []
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{align} \\begin{aligned}', () => {
            const tex = '\\begin{align} \\begin{aligned} \\end{aligned} \\end{align}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env.math.align',
                    content: [ {
                        kind: 'env.math.aligned',
                        name: 'aligned'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse \\begin{align} \\begin{alignedat}', () => {
            const tex = '\\begin{align} \\begin{alignedat}{1} a & b \\end{alignedat} \\end{align}'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env.math.align',
                    content: [ {
                        kind: 'env.math.aligned',
                        name: 'alignedat'
                    } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse unbalanced \\begin{aligned}', () => {
            const tex =
`\\begin{align}
\\begin{aligned}
\\end{align}`
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'env.math.align',
                    content: [ { kind: 'command' } ]
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse unbalanced \\end{aligned}', () => {
            const tex =
`\\begin{align}
\\end{aligned}
\\end{align}`
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ { kind: 'command' }, { kind: 'softbreak'}, { kind: 'command' }, { kind: 'softbreak'}, { kind: 'command' } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse preamble', () => {
            const tex = '\\newcommand{\\ABC}{ABC} \\begin{document} \\end{document}'
            const doc = latexParser.parsePreamble(tex)
            const expected = {
                kind: 'ast.preamble',
                rest: '\\begin{document} \\end{document}',
                content: [ {
                    kind: 'command',
                    name: 'newcommand',
                    args: [ {kind: 'arg.group'}, {kind: 'arg.group'}]
                }]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse empty preamble', () => {
            const tex = '\\begin{document} \\end{document}'
            const doc = latexParser.parse(tex, {startRule: 'Preamble'})
            const expected = {
                kind: 'ast.preamble',
                rest: '\\begin{document} \\end{document}',
                content: []
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })
    })

    suite('parse 2', () => {
        test('parse \\"\\i', () => {
            const tex = '\\"\\i'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ { kind: 'command' }, { kind: 'command' } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse Sch\\"onbrunner Schlo\\ss{} Stra\\ss e', () => {
            const tex = 'Sch\\"onbrunner Schlo\\ss{} Stra\\ss e'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {}, { kind: 'command', name: '"' }, {}, {}, {}, { kind: 'command', name: 'ss' }, {}, {}, { kind: 'command', name: 'ss' }, {} ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse a\\\\b c\\newline', () => {
            const tex = 'a\\\\b c\\newline \\par d'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {}, { kind: 'linebreak' }, {}, { kind: 'space' }, {}, { kind: 'linebreak' }, { kind: 'parbreak' }, {} ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse space + \\begin{center}', () => {
            const tex =
`a \\begin{center}
a
\\end{center}`
            const doc = latexParser.parse(tex)
            const expected = {
                content: [{ kind: 'text.string' }, { kind: 'env' } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse { a }d', () => {
            const tex = '{ a }d'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'arg.group',
                    content: [
                        { kind: 'space' },
                        { kind: 'text.string' },
                        { kind: 'space' }
                    ]
                }, {
                    kind: 'text.string'
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse x {a} { b }d', () => {
            const tex = 'x {a} { b }d'
            const doc = latexParser.parse(tex)
            const expected = {
                content: [{ kind: 'text.string' }, { kind: 'space' }, { kind: 'arg.group'}, { kind: 'space' }, { kind: 'arg.group' }, { kind: 'text.string' } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })
    })

    suite('stringify', () => {
        test('test latexParser.stringify a b', () => {
            const tex = 'a b'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), tex)
        })

        test('test latexParser.stringify a\\nb', () => {
            const tex = 'a\nb'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), tex)
        })

        test('test latexParser.stringify newcommand 01', () => {
            const tex = '\\newcommand{\\ABC}{ABC}'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), tex)
        })

        test('test latexParser.stringify newcommand 02', () => {
            const tex = '\\newcommand{\\cmark}[1][Green]{\\textcolor{#1!60!text}{\\ding{51}}}'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), tex)
        })

        test('test latexParser.stringify newcommand 03', () => {
            const tex = `
\\newcommand{\\topic}[1]{%
    \\needspace{5\\baselineskip}%
    \\begin{center} {\\itshape #1} \\end{center}%
}`
            const doc = latexParser.parse(tex)
            const expected = '\\newcommand{\\topic}[1]{ \\needspace{5\\baselineskip}\\begin{center}{\\itshape #1}\\end{center}}'
            assert.strictEqual(latexParser.stringify(doc.content, { lineBreak : '' }), expected)
        })

        test('test latexParser.stringify with lineBreak 01', () => {
            const tex = '\\begin{center} a \\\\ b \\end{center}'
            const actualTeX = '\\begin{center}\na\\\\ b\n\\end{center}\n'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content, { lineBreak : '\n' }), actualTeX)
        })

        test('test latexParser.stringify with lineBreak 02', () => {
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

        test('test stringify $a^b$', () => {
            const tex = '$a^b$'
            const actualTeX = '$a^b$'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), actualTeX)
        })

        test('test stringify $ \\sin x$', () => {
            const tex = '$ \\sin x$'
            const actualTeX = '$\\sin x$'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), actualTeX)
        })

        test('test stringify \\def\\abc [#1]#2 {#2#1abc}', () => {
            const tex = '\\def\\abc [#1]#2 {#2#1abc}'
            const actualTeX = '\\def\\abc[#1]#2{#2#1abc}'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), actualTeX)
        })

        test('test stringify \\url', () => {
            const tex = '\\url{https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83}'
            const actualTeX = '\\url{https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83}'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), actualTeX)
        })

        test('test stringify \\href[]{}{}', () => {
            const tex = '\\href[page=1]{https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83}{link}'
            const actualTeX = '\\href[page=1]{https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83}{link}'
            const doc = latexParser.parse(tex)
            assert.strictEqual(latexParser.stringify(doc.content), actualTeX)
        })

        test('test stringify \\href{}{}', () => {
            const tex = '\\href{https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83}{link}'
            const actualTeX = '\\href{https://ja.wikipedia.org/wiki/%E5%9C%B0%E7%90%83}{link}'
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

        type NotHaveContent = latexParser.Command | latexParser.AmsMathTextCommand | latexParser.DefCommand | latexParser.UrlCommand | latexParser.LabelCommand | latexParser.Parbreak | latexParser.Space | latexParser.Softbreak | latexParser.Linebreak | latexParser.AlignmentTab | latexParser.CommandParameter | latexParser.ActiveCharacter | latexParser.Ignore | latexParser.Subscript | latexParser.Superscript

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

