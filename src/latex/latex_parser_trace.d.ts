import {LatexAst} from './latex_parser_types'
import {ParserOptions, SyntaxErrorBase} from '../pegjs/pegjs_types'

export declare class SyntaxError extends SyntaxErrorBase {}

export declare function parse(input: string, options?: ParserOptions): LatexAst
