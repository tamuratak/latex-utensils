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
    test('parse a simple bib file', () => {
        const bib = `
        @Article{Lee_Robustvehiclerouting_2012,
            author    = {Lee, Chungmok and Lee, Kyungsik and Park, Sungsoo},
            title     = {Robust vehicle routing problem with deadlines and travel time/demand uncertainty},
            journal   = {Journal of the Operational Research Society},
            year      = {2012},
            volume    = {63},
            number    = {9},
            pages     = {1294--1306},
            doi       = {10.1057/jors.2011.136},
            file      = {:Lee_Robustvehiclerouting_2012 - Robust vehicle routing problem with deadlines and travel time_demand uncertainty.pdf:PDF},
            publisher = {Springer},
          }          
`
        bibtexParser.parse(bib)

    })
})
