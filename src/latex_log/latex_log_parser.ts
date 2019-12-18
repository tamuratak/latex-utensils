import * as llp from './latex_log_types'
import * as _latexLogParser from './latex_log_parser_simple'
import * as _latexLogParserWithTrace from './latex_log_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {TimeKeeper} from '../pegjs/timeout'

export * from './latex_log_types'
export {isSyntaxError, ParserOptions, SyntaxError} from '../pegjs/pegjs_types'

export function parse(s: string, _option?: ParserOptions): llp.LatexLogAst {
    const option = _option ? Object.assign({}, _option) : undefined
    if (option && option.timeout) {
        if (typeof option.timeout !== 'object') {
            option.timeout = new TimeKeeper(option.timeout)
        }
    }
    if (option && option.tracer) {
        return _latexLogParserWithTrace.parse(s, option)
    } else {
        return _latexLogParser.parse(s, option)
    }
}
