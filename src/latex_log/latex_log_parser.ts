import * as _latexLogParser from './latex_log_parser_js'
import {LatexLogAst} from './latex_log_types'
import {ParserOptions} from '../pegjs/pegjs_types'
import {EmptyTracer} from '../pegjs/empty_tracer'

export {SyntaxError} from './latex_log_parser_js'
export * from './latex_log_types'

export function parse(s: string, options?: ParserOptions): LatexLogAst {
    const opt = options || {}
    opt.tracer = opt.tracer || new EmptyTracer()
    return _latexLogParser.parse(s, opt)
}
