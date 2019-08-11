import * as assert from 'assert'
import {bibtexParser} from '../src/main'
import {equalOnlyOnExpectedOwnedProperties} from './assert_partially'


suite('bibtexParser', () => {
    test('parse a simple bib file', () => {
        const bib = `
@article{sample1,
    title={sample title}
}
@article{sample2, title={sample title2} }
@article{

title={sample title3}

}
`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ { entryType: 'article', internalKey: 'sample1' }, { entryType: 'article' }, {} ]
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
    test('parse only @comment', () => {
        const bib = `
@Comment{jabref-meta: grouping:
0 AllEntriesGroup:;
1 StaticGroup:Markings\\;2\\;1\\;\\;\\;\\;;
2 StaticGroup:James:6\\;2\\;1\\;\\;\\;\\;;
}`
        const doc = bibtexParser.parse(bib)
        assert.strictEqual(doc.content.length, 0)
    })

    test('parse @comment @article @comment', () => {
        const bib = `
% xxxxx
@comment{ xxxxx }
@article{
    title = "aaa"
}
@comment{ xxxxx }
Blah Blah
`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ { entryType: 'article' } ]
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

    test('parse entry with empty citeky', () => {
        const bib = `
@Article{,
   file = {aaa},
}`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ {
                entryType: 'article',
                internalKey: undefined
            } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })

    test('parse entry with command', () => {
        const bib = `
@Article{
   file = {\\command{aaa}}
}`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ {
                entryType: 'article',
                content: [ { name: 'file', value: { content: '\\command{aaa}' } } ]
            } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })

    test('parse entry with command', () => {
        const bib = `
@Article{
   file = "\\$\\%\\#\\&\\_\\{\\}"
}`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ {
                entryType: 'article',
                content: [ { name: 'file', value: { content: '\\$\\%\\#\\&\\_\\{\\}' } } ]
            } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })

    test('parse entry with concat', () => {
        const bib = `
@Article{
   file = "abc" # "xyz"
}`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ {
                entryType: 'article',
                content: [ { name: 'file', value: { kind: 'concat' } } ]
            } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })
})
