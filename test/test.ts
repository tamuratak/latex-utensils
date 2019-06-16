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
                assert.fail('content is empty.')
                return
            }
            const e = center.content[0]
            assert.equal(e.kind, 'text.string')
        })
        
    })
    
  })
  