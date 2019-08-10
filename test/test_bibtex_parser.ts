// import * as assert from 'assert'
import {bibtexParser} from '../src/main'
import {equalOnlyOnExpectedOwnedProperties} from './assert_partially'


suite('bibtexParser', () => {
    test('parse a simple bib file', () => {
        const bib = `
@article{sample1,
    title={sample title}
}
@article{sample2, title={sample title2} }
`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ { entryType: 'article', internalKey: 'sample1' }, { entryType: 'article' } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })
})
