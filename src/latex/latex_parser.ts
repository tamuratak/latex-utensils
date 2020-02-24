import * as lp from './latex_parser_types'
import * as _latexParser from './latex_parser_simple'
import * as _latexParserWithTrace from './latex_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {TimeKeeper} from '../pegjs/timeout'

export {findAll, findNodeAt} from './find_all'
export {pattern} from './matcher'
export {stringify} from './stringify'
export * from './latex_parser_types'
export {isSyntaxError, Location, ParserOptions, SyntaxError} from '../pegjs/pegjs_types'

export function parse(s: string, _option?: ParserOptions): lp.LatexAst {
    const option = _option ? Object.assign({}, _option) : undefined
    if (option && option.timeout) {
        if (typeof option.timeout !== 'object') {
            option.timeout = new TimeKeeper(option.timeout)
        }
    }
    if (option && option.tracer) {
        return _latexParserWithTrace.parse(s, option)
    } else {
        return _latexParser.parse(s, option)
    }
}

export function parsePreamble(s: string, option?: { timeout: number }): lp.AstPreamble {
    const timeout = option && option.timeout
    return parse(s, {startRule: 'Preamble', timeout}) as lp.AstPreamble
}
