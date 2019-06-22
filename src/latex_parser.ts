import {SyntaxError} from './latex_parser_syntaxerror'
import {ParserOptions, LatexAst} from './latex_parser_types'
export * from './latex_parser_types'
import * as _latexParser from './latex_parser_without_trace'
import * as _latexParserWithTrace from './latex_parser_with_trace'


export function parse(s: string, option?: ParserOptions) : LatexAst {
    if (option && option.tracer) {
        return _latexParserWithTrace.parse(s, option)
    } else {
        return _latexParser.parse(s, option)
    }
}

export function isSyntaxError(e: any) : e is SyntaxError {
    return (e instanceof _latexParser.SyntaxError) || (e instanceof _latexParserWithTrace.SyntaxError)
}
