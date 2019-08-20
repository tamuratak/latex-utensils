import * as _bibtexParser from './bibtex_parser_js'
import {BibtexAst} from './bibtex_parser_types'
import {ParserOptions} from '../pegjs/pegjs_types'
import {EmptyTracer} from '../pegjs/empty_tracer'

export {SyntaxError} from './bibtex_parser_js'
export * from './bibtex_parser_types'

export function parse(s: string, options?: ParserOptions): BibtexAst {
    const opt = options || {}
    opt.tracer = opt.tracer || new EmptyTracer()
    return _bibtexParser.parse(s, opt)
}
