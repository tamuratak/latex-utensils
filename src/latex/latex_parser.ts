/**
 * LaTeX parser.
 *
 * @example
 * ```ts
 * import {latexParser as lp} from 'latex-utensils'
 *
 * const ast = lp.parse('a $b+c$ d')
 * const pat = lp.pattern(lp.isInlienMath)
 *               .child(lp.isMathCharacter)
 * const ret0 = pat.matchAll(ast.content)
 * const ret1 = lp.find(ast.content, lp.isInlienMath)
 * ```
 */

/** */
import * as lp from './latex_parser_types'
import * as lpSimple from './latex_parser_simple'
import * as lpWithTrace from './latex_parser_trace'
import {ParserOptions as ParserOptionsBase} from '../pegjs/pegjs_types'
import {TimeKeeper} from '../pegjs/timeout'

export {find, findAll, findAllSequences, findNodeAt} from './find_all'
export type {FindResult, Position, PositionLc, PositionOs, SequenceResult, Typeguard} from './find_all'
export {pattern} from './matcher'
export type {MatchOptions, MatchResult, Pattern} from './matcher'
export {stringify} from './stringify'
export * from './latex_parser_types'
export {isSyntaxError} from '../pegjs/pegjs_types'
export type {Location, SyntaxError} from '../pegjs/pegjs_types'

/**
 * LaTeX parser options.
 */
export interface ParserOptions extends ParserOptionsBase {
    /**
     * Specifies a rule with which the parser begins. If `'Root'` is set, the whole document is parsed.
     * If `'Preamble'` is set, only the preamble is parsed.
     *
     * @default 'Root'
     */
    startRule?: 'Root' | 'Preamble';
    /**
     * All the comments in the LaTeX document will be extracted into a returned AST also.
     *
     * @default false
     */
    enableComment?: boolean;
    /**
     * The `location` property will be available for `MathCharacter`.
     *
     * @default false
     */
    enableMathCharacterLocation?: boolean;
}

/**
 * Parses a LaTeX document and returns a LaTeX AST.
 * @param texString LaTeX document to be parsed.
 * @param optArg Options.
 *
 * @example
 * ```ts
 * import {latexParser} from 'latex-utensils'
 *
 * const ast = latexParser.parse('a $b+c$ d')
 * ```
 */
export function parse(
    texString: string,
    optArg?: ParserOptions
): lp.LatexAst {
    const option = optArg ? Object.assign({}, optArg) : undefined
    if (option && option.timeout) {
        if (typeof option.timeout !== 'object') {
            option.timeout = new TimeKeeper(option.timeout)
        }
    }
    if (option && option.tracer) {
        return lpWithTrace.parse(texString, option)
    } else {
        return lpSimple.parse(texString, option)
    }
}

/**
 *
 * @param texString
 * @param optArg
 */
export function parsePreamble(texString: string, optArg?: { timeout: number }): lp.AstPreamble {
    const timeout = optArg && optArg.timeout
    return parse(texString, {startRule: 'Preamble', timeout}) as lp.AstPreamble
}
