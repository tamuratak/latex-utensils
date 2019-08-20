import * as bp from './bibtex_parser_types'
import * as _bibtexParser from './bibtex_parser_simple'
import * as _bibtexParserWithTrace from './bibtex_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {TimeoutTracer} from '../pegjs/timeout'

export * from './bibtex_parser_types'
export {ParserOptions} from '../pegjs/pegjs_types'

export function parse(s: string, option?: ParserOptions): bp.BibtexAst {
    if (option && option.timeout && option.tracer) {
        throw new Error('tracer and timeout not allowed at the same time.')
    }
    if (option && option.timeout) {
        const tracer = new TimeoutTracer(option.timeout)
        return _bibtexParserWithTrace.parse(s, { tracer })
    } else if (option && option.tracer) {
        return _bibtexParserWithTrace.parse(s, option)
    } else {
        return _bibtexParser.parse(s, option)
    }
}
