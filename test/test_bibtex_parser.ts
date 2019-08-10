import * as assert from 'assert'
import {bibtexParser} from '../src/main'
import {equalOnlyOnExpectedOwnedProperties} from './assert_partially'


suite('bibtexParser', () => {
    test('parse', () => {
        const bib = `
@article{sample1,
    title={sample title}
}
@article{sample2, title={sample title2} }
`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ { entryType: 'article' }, { entryType: 'article' } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
        const entry = doc.content[0]
        if (bibtexParser.isEntry(entry) && entry.internalKey) {
            assert.strictEqual(entry.internalKey, 'sample1')
        }
    })
})
