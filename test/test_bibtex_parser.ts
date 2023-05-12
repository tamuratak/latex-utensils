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
        const bib = '@Comment{ xxx }'
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

    test('parse entry with quotes', () => {
        const bib = `
@article{
    title={sample \\"aaaa\\" title},
    name={sample "aaaa" title"}
}`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ { entryType: 'article' } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })

    test('parse entry with quotes', () => {
        const bib = `
@article{
    name="J{\\"u}rgensen"
}`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [ {
                entryType: 'article',
                content: [ { name: 'name', value: { content: 'J{\\"u}rgensen' } } ]
            } ]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })

    test('should not throw SyntaxError', () => {
        const invalidBibs = ['@article{ isbn = 1-2-3 }']
        for (const bib of invalidBibs) {
            bibtexParser.parse(bib)
        }
    })

    test('should throw SyntaxError', () => {
        const invalidBibs = ['@article{ title = 1+2+3 }']
        for (const bib of invalidBibs) {
            assert.throws(
                () => {
                    bibtexParser.parse(bib)
                },
                (e: any) => {
                    return e && bibtexParser.isSyntaxError(e)
                },
                `parsing ${bib}`
            )
        }
    })

    test('parse string entry', () => {
        const bib = `
@string{
   a&b = "aaabbb"
}`
        const doc = bibtexParser.parse(bib)
        const expected: any = {
            content: [{
                entryType: 'string',
                abbreviation: 'a&b',
                value: {
                    content: 'aaabbb'
                },
            }]
        }
        equalOnlyOnExpectedOwnedProperties(doc, expected)
    })

})
