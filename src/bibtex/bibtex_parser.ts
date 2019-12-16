import {SyntaxError} from './bibtex_parser_syntaxerror'
import * as bp from './bibtex_parser_types'
import * as _bibtexParser from './bibtex_parser_simple'
import * as _bibtexParserWithTrace from './bibtex_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {TimeKeeper} from '../pegjs/timeout'

export * from './bibtex_parser_types'
export {ParserOptions} from '../pegjs/pegjs_types'

export function parse(s: string, _option?: ParserOptions): bp.BibtexAst {
    const option = _option ? Object.assign({}, _option) : undefined
    if (option && option.timeout) {
        if (typeof option.timeout !== 'object') {
            option.timeout = new TimeKeeper(option.timeout)
        }
    }
    if (option && option.tracer) {
        return _bibtexParserWithTrace.parse(s, option)
    } else {
        return _bibtexParser.parse(s, option)
    }
}

export function isSyntaxError(e: any): e is SyntaxError {
    return e instanceof _bibtexParser.SyntaxError || e instanceof _bibtexParserWithTrace.SyntaxError
}
