import {SyntaxError} from './latex_parser_syntaxerror'
import * as lp from './latex_parser_types'
export * from './latex_parser_types'
import * as _latexParser from './latex_parser_with_trace'
import {TimeoutTracer} from '../pegjs/timeout'

export function parse(s: string, option?: lp.ParserOptions): lp.LatexAst {
    if (option && option.timeout && option.tracer) {
        throw new Error('tracer and timeout not allowed at the same time.')
    }
    if (option && option.timeout) {
        const tracer = new TimeoutTracer(option.timeout)
        return _latexParser.parse(s, { tracer })
    } else if (option && option.tracer) {
        return _latexParser.parse(s, option)
    } else {
        return _latexParser.parse(s, option)
    }
}

export function parsePreamble(s: string): lp.LatexAst {
    return _latexParser.parse(s, {startRule: 'Preamble'})
}

export function isSyntaxError(e: any): e is SyntaxError {
    return e instanceof _latexParser.SyntaxError
}


function stringifyArray(arry: lp.Node[], options: { lineBreak: string }): string {
    const len = arry.length
    let ret = ''
    for (let i = 0; i < len; i++) {
        const cur = arry[i]
        ret += stringify(cur, options)
        if (lp.isCommandParameter(cur)) {
            continue
        }
        if (i + 1 < len && lp.isTextString(arry[i + 1])) {
            ret += ' '
            continue
        }
        if (i + 1 < len && lp.isMathCharacter(arry[i + 1]) && !lp.isMathCharacter(cur)) {
            ret += ' '
            continue
        }
        if (i + 1 < len && lp.isCommand(cur) && cur.args.length === 0 && lp.isCommandParameter(arry[i + 1])) {
            ret += ' '
            continue
        }
    }
    return ret
}

export function stringify(
    node: lp.Node | lp.Node[],
    options = { lineBreak: '' }
): string {
    const lineBreak = options.lineBreak
    if (Array.isArray(node)) {
        return stringifyArray(node, options)
    }
    if (lp.isTextString(node)) {
        return node.content
    }
    if (lp.isCommand(node)) {
        return '\\' + node.name + stringifyArray(node.args, options)
    }
    if (lp.isAmsMathTextCommand(node)) {
        return '\\text{' + node.arg + '}'
    }
    if (lp.isEnvironment(node) || lp.isMathEnv(node) || lp.isMathEnvAligned(node)) {
        const begin = '\\begin{' + node.name + '}'
        const args = stringifyArray(node.args, options)
        const content = stringifyArray(node.content, options)
        const end = '\\end{' + node.name + '}'
        return begin + args.trim() + lineBreak + content.trim() + lineBreak + end + lineBreak
    }
    if (lp.isGroup(node)) {
        return '{' + stringifyArray(node.content, options) + '}'
    }
    if (lp.isOptionalArg(node)) {
        return '[' + stringifyArray(node.content, options) + ']'
    }
    if (lp.isParbreak(node)) {
        return '\\par' + lineBreak
    }
    if (lp.isSupescript(node)) {
        return '^' + stringifyArray(node.content, options)
    }
    if (lp.isSubscript(node)) {
        return '_' + stringifyArray(node.content, options)
    }
    if (lp.isAlignmentTab(node)) {
        return '&'
    }
    if (lp.isCommandParameter(node)) {
        return '#' + node.nargs
    }
    if (lp.isActiveCharacter(node)) {
        return '~'
    }
    if (lp.isIgnore(node)) {
        return ''
    }
    if (lp.isVerb(node)) {
        return '\\verb' + node.escape + node.content + node.escape
    }
    if (lp.isVerbatim(node)) {
        return '\\begin{verbatim}' + node.content + '\\end{verbatim}' + lineBreak
    }
    if (lp.isMinted(node)) {
        const args = stringify(node.args)
        return '\\begin{minted}' + args + node.content + '\\end{minted}' + lineBreak
    }
    if (lp.isLstlisting(node)) {
        const arg = node.arg ? stringify(node.arg) : ''
        return '\\begin{lstlisting}' + arg + node.content + '\\end{lstlisting}'
    }
    if (lp.isInlienMath(node)) {
        return '$' + stringifyArray(node.content, options) + '$'
    }
    if (lp.isDisplayMath(node)) {
        return '\\[' + lineBreak + stringifyArray(node.content, options).trim() + lineBreak + '\\]' + lineBreak
    }
    if (lp.isMathCharacter(node)) {
        return node.content
    }
    if (lp.isMathMatchingParen(node)) {
        return '\\left' + node.left + stringifyArray(node.content, options) + '\\right' + node.right
    }

    // node must be the never type here.
    const dummy: never = node
    return dummy
}
