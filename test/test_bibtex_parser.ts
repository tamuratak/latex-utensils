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
    test('parse fields ending ,', () => {
        const bib = `
        @Article{key1,
            file      = {aaa},
            publisher = {bbb},
        }`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ { entryType: 'article', internalKey: 'key1' } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })

    test('parse bib with comments', () => {
        const bib = `
% Encoding: UTF-8

@Article{key1,
   file      = {aaa},
   publisher = {bbb}
}`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ { entryType: 'article', internalKey: 'key1' } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })

    test('parse bib with abbreviation', () => {
        const bib = `
@Article{key1,
   file      = {aaa},
   publisher = {bbb},
   journal  = IEEE_J_ITS,
}`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ {
                entryType: 'article',
                internalKey: 'key1',
                content: [
                    {}, {}, { name: 'journal', value: {content: 'IEEE_J_ITS'} }
                ]
            } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })
})
