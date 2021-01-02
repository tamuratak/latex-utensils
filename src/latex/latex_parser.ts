import * as lp from './latex_parser_types'
import * as lpSimple from './latex_parser_simple'
import * as lpWithTrace from './latex_parser_trace'
import {ParserOptions} from '../pegjs/pegjs_types'
import {TimeKeeper} from '../pegjs/timeout'

export {find, findAll, findAllSequences, findNodeAt} from './find_all'
export type {FindResult, Position, PositionLc, PositionOs, Typeguard} from './find_all'
export {pattern} from './matcher'
export type {Pattern} from './matcher'
export {stringify} from './stringify'
export * from './latex_parser_types'
export {isSyntaxError} from '../pegjs/pegjs_types'
export type {Location, ParserOptions, SyntaxError} from '../pegjs/pegjs_types'

/**
 *
 * @param texString
 * @param optArg
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
