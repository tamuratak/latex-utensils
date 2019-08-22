import * as llp from './latex_log_types'
import * as _latexLogParser from './latex_log_parser_simple'
import * as _latexLogParserWithTrace from './latex_log_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {parse as _parse} from '../pegjs/parse'

export * from './latex_log_types'
export {ParserOptions} from '../pegjs/pegjs_types'

export function parse(s: string, _option?: ParserOptions): llp.LatexLogAst {
    return _parse(s, _option, _latexLogParser.parse, _latexLogParserWithTrace.parse)
}
