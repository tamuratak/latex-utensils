import {ParserOptions, LatexAst} from './latex_parser_types'
import {SyntaxErrorBase} from '../pegjs/pegjs_types'

export declare class SyntaxError extends SyntaxErrorBase {}

export declare function parse(input: string, options?: ParserOptions): LatexAst
