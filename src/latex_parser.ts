import {SyntaxError} from './latex_parser_syntaxerror'
import * as lp from './latex_parser_types'
export * from './latex_parser_types'
import * as _latexParser from './latex_parser_without_trace'
import * as _latexParserWithTrace from './latex_parser_with_trace'


export function parse(s: string, option?: lp.ParserOptions) : lp.LatexAst {
    if (option && option.tracer) {
        return _latexParserWithTrace.parse(s, option)
    } else {
        return _latexParser.parse(s, option)
    }
}

export function isSyntaxError(e: any) : e is SyntaxError {
    return (e instanceof _latexParser.SyntaxError) || (e instanceof _latexParserWithTrace.SyntaxError)
}


function stringifyArray(arry: lp.Node[]) : string {
    const len = arry.length
    let ret = ''
    for (let i = 0; i < len; i++) {
        const cur = arry[i]
        ret += stringify(cur)
        if (lp.isCommandParameter(cur)) {
            continue
        }
        if (i+1 < len && lp.isTextString(arry[i+1])) {
            ret += ' '
            continue
        }
        if (i+1 < len && lp.isMathCharacter(arry[i+1]) && !lp.isMathCharacter(cur)) {
            ret += ' '
            continue
        }
        if (i+1 < len && lp.isCommand(cur) && cur.args.length === 0 && lp.isCommandParameter(arry[i+1])) {
            ret += ' '
            continue
        }
    }
    return ret
}

export function stringify(node: lp.Node | lp.Node[]) : string {
    if (node instanceof Array) {
        return stringifyArray(node)
    }
    if (lp.isTextString(node)) {
        return node.content
    }
    if (lp.isCommand(node)) {
        return '\\' + node.name + stringifyArray(node.args)
    }
    if (lp.isAmsMathTextCommand(node)) {
        return '\\text{' + node.arg + '}'
    }
    if (lp.isEnvironment(node) || lp.isMathEnv(node) || lp.isMathEnvAligned(node)) {
        const begin = '\\begin{' + node.name + '}'
        const args = stringifyArray(node.args)
        const content = stringifyArray(node.content)
        const end = '\\end{' + node.name + '}'
        return begin + args + content + end
    }
    if (lp.isGroup(node)) {
        return '{' + stringifyArray(node.content) + '}'
    }
    if (lp.isOptionalArg(node)) {
        return '[' + stringifyArray(node.content) + ']'
    }
    if (lp.isParbreak(node)) {
        return '\\par'
    }
    if (lp.isSupescript(node)) {
        return '^' + stringifyArray(node.content)
    }
    if (lp.isSubscript(node)) {
        return '_' + stringifyArray(node.content)
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
        return '\\begin{verbatim}' + node.content + '\\end{verbatim}'
    }
    if (lp.isMinted(node)) {
        return '\\begin{minted}' + node.content + '\\end{minted}'
    }
    if (lp.isInlienMath(node)) {
        return '$' + stringifyArray(node.content) + '$'
    }
    if (lp.isDisplayMath(node)) {
        return '\\[' + stringifyArray(node.content) + '\\]'
    }
    if (lp.isMathCharacter(node)) {
        return node.content
    }
    if (lp.isMathMatchingParen(node)) {
        return '\\left' + node.left + stringifyArray(node.content) + '\\right' + node.right
    }
    throw 'not reachable here'
}
