import * as assert from 'assert'
import {latexParser} from '../src/main'
// import * as util from 'util'

function equalOnlyOnExpectedOwnedProperties(actual: any, expected: any, message?: string) {
    if (expected === null || typeof expected !== 'object') {
        if (actual !== expected) {
            throw new assert.AssertionError({actual, expected, message})
        }
        return
    }
    try {
        if (expected instanceof Array) {
            if (!(actual instanceof Array) || actual.length !== expected.length) {
                throw new assert.AssertionError({actual, expected, message})
            }
            for (let i = 0; i < expected.length; i++) {
                equalOnlyOnExpectedOwnedProperties(actual[i], expected[i])
            }
            return
        }
        for (const key in expected) {
            equalOnlyOnExpectedOwnedProperties(actual[key], expected[key])
        }
    } catch (e) {
        if (e instanceof assert.AssertionError) {
            throw new assert.AssertionError({actual, expected, message})
        } else {
            throw e
        }
    }
}

suite('latexParser', () => {

    setup(() => {
      // .
    })

    suite('parse', () => {
        test('basic parse test', () => {
            const tex = `
\\begin{center}
lmn
\\end{center}
            `
            const doc = latexParser.parse(tex) as any
            const expected = {
                content: [{
                    kind: 'env',
                    content: [{
                        kind: 'text.string',
                        content: 'lmn',
                        location: {start: {line: 3, column: 1}, end: {line: 3, column: 4}}
                }]}]}
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse newenvironment command', () => {
            const tex = `\\newenvironment{newabc}
{\\begin{abc}}
{\\end{abc}}
            `
            const doc = latexParser.parse(tex) as any
            const expected = {
                content: [ { kind: 'command',
                             name: 'newenvironment',
                             args: [{kind: 'arg.group'}, {kind: 'arg.group'}, {kind: 'arg.group'}] } ]
            }
            equalOnlyOnExpectedOwnedProperties(doc, expected)
        })

        test('parse invalid commands without error', () => {
            const tex = `\\begin{abc}`
            const doc = latexParser.parse(tex)
            const command = doc.content[0]
            if (command === undefined) {
                assert.fail()
                return
            }
            if (command.kind !== 'command') {
                assert.fail()
                return
            }
            const arg = command.args[0]
            const textString = arg.content[0]
            if (textString.kind !== 'text.string') {
                assert.fail()
                return
            }
            assert.equal(textString.content, 'abc')
        })

        test('should throw SyntaxError', () => {
            const invalidTexts = [
                `{`,
                `$`,
                `$$`
            ]
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

    })

  })

