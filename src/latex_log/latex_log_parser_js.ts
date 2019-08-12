import {SyntaxErrorBase} from '../pegjs/pegjs_types'
import {LatexLogAst} from './latex_log_types'

export declare class SyntaxError extends SyntaxErrorBase {}

export declare function parse(input: string): LatexLogAst
