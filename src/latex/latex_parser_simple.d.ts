import {LatexAst} from './latex_parser_types'
import {Location, ParserOptions, SyntaxErrorBase} from '../pegjs/pegjs_types'

export declare class SyntaxError extends SyntaxErrorBase {}

export declare function parse<Opt extends ParserOptions>(
    texString: string,
    option?: Opt
): LatexAst<Opt extends {enableMathCharacterLocation: true} ? Location : Location | undefined>
