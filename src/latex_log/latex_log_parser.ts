import * as llp from './latex_log_types'
import * as _latexLogParser from './latex_log_parser_simple'
import * as _latexLogParserWithTrace from './latex_log_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {TimeoutTracer} from '../pegjs/timeout'

export * from './latex_log_types'
export {ParserOptions} from '../pegjs/pegjs_types'

export function parse(s: string, option?: ParserOptions): llp.LatexLogAst {
    if (option && option.timeout && option.tracer) {
        throw new Error('tracer and timeout not allowed at the same time.')
    }
    if (option && option.timeout) {
        const tracer = new TimeoutTracer(option.timeout)
        return _latexLogParserWithTrace.parse(s, { tracer })
    } else if (option && option.tracer) {
        return _latexLogParserWithTrace.parse(s, option)
    } else {
        return _latexLogParser.parse(s, option)
    }
}
