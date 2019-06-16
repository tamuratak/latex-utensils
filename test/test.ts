import * as assert from 'assert'
import {latexParser} from '../src/main'
// import * as util from 'util'

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
            const doc = latexParser.parse(tex)
            const center = doc.content[0]
            if (center === undefined) {
                assert.fail('content is empty.')
                return
            }
            if (center.kind !== 'env') {
                assert.fail()
                return
            }
            const e = center.content[0]
            if (e.kind !== 'text.string') {
                assert.fail()
                return
            }
            assert.equal(e.content, 'lmn')
            assert.equal(e.location.start.line, 3)
            assert.equal(e.location.start.column, 1)
            assert.equal(e.location.end.line, 3)
            assert.equal(e.location.end.column, 4)
        })

        test('parse newenvironment command', () => {
            const tex = `\\newenvironment{newabc}
{\\begin{abc}}
{\\end{abc}}
            `
            const doc = latexParser.parse(tex)
            const command = doc.content[0]
            if (command.kind !== 'command') {
                assert.fail()
                return
            }
            assert.equal(command.name, 'newenvironment')
            assert.equal(command.args.length, 3)
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
            const invalid_texts = [
                `{`,
                `$`,
                `$$`
            ]
            for (const tex of invalid_texts) {
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

