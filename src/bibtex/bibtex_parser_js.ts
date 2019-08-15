import {SyntaxErrorBase, ParserOptions} from '../pegjs/pegjs_types'
import {BibtexAst} from './bibtex_parser_types'

export declare class SyntaxError extends SyntaxErrorBase {}

export declare function parse(input: string, opt?: ParserOptions): BibtexAst
