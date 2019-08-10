
import {SyntaxErrorBase} from '../pegjs/pegjs_types'
import {BibtexAst} from './bibtex_parser_types'

export declare class SyntaxError extends SyntaxErrorBase {}

export declare function parse(input: string): BibtexAst
