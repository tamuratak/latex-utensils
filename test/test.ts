import * as assert from 'assert'
import {latexParser} from '../src/main'
import {equalOnlyOnExpectedOwnedProperties} from './assert_partially'


suite('latexParser', () => {

    suite('parse', () => {
        test('basic parse test', () => {
            let tex = `
\\begin{center}
lmn
\\end{center}
            `
            let doc = latexParser.parse(tex)
            let expected: any = {
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

            tex = `$1$`
            doc = latexParser.parse(tex)
            expected = {
                content: [ {
                    kind: 'math.inline',
                    content: [ {
                        kind: 'text.string',
                        content: '1'
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

        test('parse invalid commands without error', () => {
            const tex = `\\begin{abc}`
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

        test('should throw SyntaxError', () => {
            const invalidTexts = [ `{`, `$`, `$$` ]
            for (const tex of invalidTexts) {
                assert.throws(
                    () => {
                        latexParser.parse(tex)
                    },
                    (e: any) => {
                        return e && e instanceof latexParser.SyntaxError
                    },
                    `parsing ${tex}`
                )
            }
        })

        test('parse elements including only spaces', () => {
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

        test('parse elements including only spaces', () => {
            const tex = '$ $'
            const root = latexParser.parse(tex)
            const expected = {
                content: [ {
                    kind: 'math.inline',
                    content: []
                } ]
            }
            equalOnlyOnExpectedOwnedProperties(root, expected)
        })

    })
})

