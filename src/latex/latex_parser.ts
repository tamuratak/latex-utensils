import {SyntaxError} from './latex_parser_syntaxerror'
import * as lp from './latex_parser_types'
import * as _latexParser from './latex_parser_simple'
import * as _latexParserWithTrace from './latex_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {TimeoutTracer} from '../pegjs/timeout'

export {stringify} from './stringify'
export * from './latex_parser_types'
export {ParserOptions} from '../pegjs/pegjs_types'

export function parse(s: string, option?: ParserOptions): lp.LatexAst {
    if (option && option.timeout && option.tracer) {
        throw new Error('tracer and timeout not allowed at the same time.')
    }
    if (option && option.timeout) {
        const tracer = new TimeoutTracer(option.timeout)
        return _latexParserWithTrace.parse(s, { tracer })
    } else if (option && option.tracer) {
        return _latexParserWithTrace.parse(s, option)
    } else {
        return _latexParser.parse(s, option)
    }
}

export function parsePreamble(s: string): lp.LatexAst {
    return _latexParser.parse(s, {startRule: 'Preamble'})
}

export function isSyntaxError(e: any): e is SyntaxError {
    return e instanceof _latexParser.SyntaxError || e instanceof _latexParserWithTrace.SyntaxError
}
