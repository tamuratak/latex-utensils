import * as lp from './latex_parser_types'
import * as lpSimple from './latex_parser_simple'
import * as lpWithTrace from './latex_parser_trace'
import {ParserOptions, Location} from '../pegjs/pegjs_types'
import {TimeKeeper} from '../pegjs/timeout'

export {find, findAll, findAllSequences, findNodeAt} from './find_all'
export {pattern} from './matcher'
export {stringify} from './stringify'
export * from './latex_parser_types'
export {isSyntaxError, Location, ParserOptions, SyntaxError} from '../pegjs/pegjs_types'

export function parse<Opt extends ParserOptions>(
    texString: string,
    optArg?: Opt
): lp.LatexAst<Opt extends {enableMathCharacterLocation: true} ? Location : Location | undefined> {
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

export function parsePreamble(s: string, option?: { timeout: number }): lp.AstPreamble {
    const timeout = option && option.timeout
    return parse(s, {startRule: 'Preamble', timeout}) as lp.AstPreamble
}
