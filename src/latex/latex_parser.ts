import {SyntaxError} from './latex_parser_syntaxerror'
import * as lp from './latex_parser_types'
import * as _latexParser from './latex_parser_simple'
import * as _latexParserWithTrace from './latex_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {parse as _parse} from '../pegjs/parse'

export {stringify} from './stringify'
export * from './latex_parser_types'
export {ParserOptions} from '../pegjs/pegjs_types'

export function parse(s: string, _option?: ParserOptions): lp.LatexAst {
  return _parse(s, _option, _latexParser.parse, _latexParserWithTrace.parse)
}

export function parsePreamble(s: string, option?: { timeout: number }): lp.LatexAst {
    const timeout = option && option.timeout
    return parse(s, {startRule: 'Preamble', timeout})
}

export function isSyntaxError(e: any): e is SyntaxError {
    return e instanceof _latexParser.SyntaxError || e instanceof _latexParserWithTrace.SyntaxError
}
