import * as llp from './latex_log_types'
import * as llpSimple from './latex_log_parser_simple'
import * as llpWithTrace from './latex_log_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {TimeKeeper} from '../pegjs/timeout'

export * from './latex_log_types'
export {isSyntaxError} from '../pegjs/pegjs_types'
export type {ParserOptions, SyntaxError} from '../pegjs/pegjs_types'

export function parse(s: string, optArg?: ParserOptions): llp.LatexLogAst {
    const option = optArg ? Object.assign({}, optArg) : undefined
    if (option && option.timeout) {
        if (typeof option.timeout !== 'object') {
            option.timeout = new TimeKeeper(option.timeout)
        }
    }
    if (option && option.tracer) {
        return llpWithTrace.parse(s, option)
    } else {
        return llpSimple.parse(s, option)
    }
}
