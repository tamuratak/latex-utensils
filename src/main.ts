import {ParserOptions, LatexAst, SyntaxError} from './latex_parser_types'
import * as _latexParser from './latex_parser'
import * as _latexParserWithTrace from './latex_parser_with_trace'

export const latexParser = {
    parse: (s: string, option?: ParserOptions) : LatexAst => {
        if (option && option.tracer) {
            return _latexParserWithTrace.parse(s, option)
        } else {
            return _latexParser.parse(s, option)
        }
    },
    isSyntaxError: (e: any) : e is SyntaxError => {
        return (e instanceof _latexParser.SyntaxError) || (e instanceof _latexParserWithTrace.SyntaxError)
    }
}
