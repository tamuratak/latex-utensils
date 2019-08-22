import * as bp from './bibtex_parser_types'
import * as _bibtexParser from './bibtex_parser_simple'
import * as _bibtexParserWithTrace from './bibtex_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {parse as _parse} from '../pegjs/parse'

export * from './bibtex_parser_types'
export {ParserOptions} from '../pegjs/pegjs_types'

export function parse(s: string, _option?: ParserOptions): bp.BibtexAst {
  return _parse(s, _option, _bibtexParser.parse, _bibtexParserWithTrace.parse)
}
