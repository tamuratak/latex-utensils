import {Location} from '../pegjs/pegjs_types'

export type TextString = {
    kind: 'text.string';
    content: string;
    location: Location;
}

export function isTextString(node: Node | undefined): node is TextString {
    return !!node && node.kind === 'text.string'
}

export type Command = {
    kind: 'command';
    name: string;
    args: (OptionalArg | Group)[];
    location: Location;
}

export function isCommand(node: Node | undefined): node is Command {
    return !!node && node.kind === 'command'
}

export type AmsMathTextCommand = {
    kind: 'command.text';
    arg: Group;
    location: Location;
}

export function isAmsMathTextCommand(node: Node | undefined): node is AmsMathTextCommand {
    return !!node && node.kind === 'command.text'
}

export type DefCommand = {
    kind: 'command.def';
    name: 'def';
    token: string;
    args: (OptionalArg | CommandParameter | Group)[];
    location: Location;
}

export function isDefCommand(node: Node | undefined): node is DefCommand {
    return !!node && node.kind === 'command.def'
}

export type UrlCommand = {
    kind: 'command.url';
    name: 'url';
    url: string;
    location: Location;
}

export function isUrlCommand(node: Node | undefined): node is UrlCommand {
    return !!node && node.kind === 'command.url'
}

export type HrefCommand = {
    kind: 'command.href';
    name: 'href';
    url: string;
    arg: OptionalArg | undefined;
    content: Node[];
    location: Location;
}

export function isHrefCommand(node: Node | undefined): node is HrefCommand {
    return !!node && node.kind === 'command.href'
}

export type LabelCommand = {
    kind: 'command.label';
    name: 'label' | 'ref' | 'eqref' | 'autoref';
    label: string;
    location: Location;
}

export function isLabelCommand(node: Node | undefined): node is LabelCommand {
    return !!node && node.kind === 'command.label'
}

export type Environment = {
    kind: 'env';
    name: string;
    args: (OptionalArg | Group)[];
    content: Node[];
    location: Location;
}

export function isEnvironment(node: Node | undefined): node is Environment {
    return !!node && node.kind === 'env'
}

export type MathEnv = {
    kind: 'env.math.align';
    name: string;
    args: (OptionalArg | Group)[];
    content: Node[];
    location: Location;
}

export function isMathEnv(node: Node | undefined): node is MathEnv {
    return !!node && node.kind === 'env.math.align'
}

export type MathEnvAligned = {
    kind: 'env.math.aligned';
    name: string;
    args: (OptionalArg | Group)[];
    content: Node[];
    location: Location;
}

export function isMathEnvAligned(node: Node | undefined): node is MathEnvAligned {
    return !!node && node.kind === 'env.math.aligned'
}

export type Group = {
    kind: 'arg.group';
    content: Node[];
    location: Location;
}

export function isGroup(node: Node | undefined): node is Group {
    return !!node && node.kind === 'arg.group'
}

export type OptionalArg = {
    kind: 'arg.optional';
    content: Node[];
    location: Location;
}

export function isOptionalArg(node: Node | undefined): node is OptionalArg {
    return !!node && node.kind === 'arg.optional'
}

export type Parbreak = {
    kind: 'parbreak';
    location: Location;
}

export function isParbreak(node: Node | undefined): node is Parbreak {
    return !!node && node.kind === 'parbreak'
}

export type Space = {
    kind: 'space';
}

export function isSpace(node: Node | undefined): node is Space {
    return !!node && node.kind === 'space'
}

export type Softbreak = {
    kind: 'softbreak';
}

export function isSoftbreak(node: Node | undefined): node is Softbreak {
    return !!node && node.kind === 'softbreak'
}

export type Linebreak = {
    kind: 'linebreak';
    name: '\\' | '\\*' | 'newline' | 'newline*' | 'linebreak'
    arg: OptionalArg | undefined;
    location: Location;
}

export function isLinebreak(node: Node | undefined): node is Linebreak {
    return !!node && node.kind === 'linebreak'
}

export type Superscript = {
    kind: 'superscript';
    arg: Node | undefined;
    location: Location;
}

export function isSuperscript(node: Node | undefined): node is Superscript {
    return !!node && node.kind === 'superscript'
}

export type Subscript = {
    kind: 'subscript';
    arg: Node | undefined;
    location: Location;
}

export function isSubscript(node: Node | undefined): node is Subscript {
    return !!node && node.kind === 'subscript'
}

export type AlignmentTab = {
    kind: 'alignmentTab';
    location: Location;
}

export function isAlignmentTab(node: Node | undefined): node is AlignmentTab {
    return !!node && node.kind === 'alignmentTab'
}

export type CommandParameter = {
    kind: 'commandParameter';
    nargs: string;
    location: Location;
}

export function isCommandParameter(node: Node | undefined): node is CommandParameter {
    return !!node && node.kind === 'commandParameter'
}

export type ActiveCharacter = {
    kind: 'activeCharacter';
    location: Location;
}

export function isActiveCharacter(node: Node | undefined): node is ActiveCharacter {
    return !!node && node.kind === 'activeCharacter'
}

export type Ignore = {
    kind: 'ignore';
    location: Location;
}

export function isIgnore(node: Node | undefined): node is Ignore {
    return !!node && node.kind === 'ignore'
}

export type Verb = {
    kind: 'verb';
    name: string;
    escape: string;
    content: string;
    location: Location;
}

export function isVerb(node: Node | undefined): node is Verb {
    return !!node && node.kind === 'verb'
}

export type Verbatim = {
    kind: 'env.verbatim';
    name: string;
    content: string;
    location: Location;
}

export function isVerbatim(node: Node | undefined): node is Verbatim {
    return !!node && node.kind === 'env.verbatim'
}

export type Minted = {
    kind: 'env.minted';
    name: 'minted';
    args: (OptionalArg | Group)[];
    content: string;
    location: Location;
}

export function isMinted(node: Node | undefined): node is Minted {
    return !!node && node.kind === 'env.minted'
}

export type Lstlisting = {
    kind: 'env.lstlisting';
    name: 'lstlisting';
    arg?: OptionalArg;
    content: string;
    location: Location;
}

export function isLstlisting(node: Node | undefined): node is Lstlisting {
    return !!node && node.kind === 'env.lstlisting'
}

export type InlienMath = {
    kind: 'inlineMath';
    content: Node[];
    location: Location;
}

export function isInlienMath(node: Node | undefined): node is InlienMath {
    return !!node && node.kind === 'inlineMath'
}

export type DisplayMath = {
    kind: 'displayMath';
    content: Node[];
    location: Location;
}

export function isDisplayMath(node: Node | undefined): node is DisplayMath {
    return !!node && node.kind === 'displayMath'
}

export type MathCharacter = {
    kind: 'math.character';
    content: string;
    location: Location | undefined;
}

export function isMathCharacter(node: Node | undefined): node is MathCharacter {
    return !!node && node.kind === 'math.character'
}

export type MatchingDelimiters = {
    kind: 'math.matching_delimiters';
    left: string;
    right: string;
    content: Node[];
    location: Location;
}

export function isMatchingDelimiters(node: Node | undefined): node is MatchingDelimiters {
    return !!node && node.kind === 'math.matching_delimiters'
}

export type MathDelimiters = {
    kind: 'math.math_delimiters';
    lcommand: string;
    rcommand: string;
    left: string;
    right: string;
    content: Node[];
    location: Location;
}

export function isMathDelimiters(node: Node | undefined): node is MathDelimiters {
    return !!node && node.kind === 'math.math_delimiters'
}

export function hasContent(node: Node | undefined): node is Extract<Node, {content: any}> {
      return !!node && node.hasOwnProperty('content')
}

export function hasContentArray(node: Node | undefined): node is Extract<Node, {content: Node[]}> {
    return !!node && node.hasOwnProperty('content') && Array.isArray((node as any)['content'])
}

export function hasArgsArray(node: Node | undefined): node is Extract<Node, {args: Node[]}> {
    return !!node && node.hasOwnProperty('args') && Array.isArray((node as any)['args'])
}

export type Node
= TextString
| Command
| AmsMathTextCommand
| DefCommand
| UrlCommand
| HrefCommand
| LabelCommand
| Environment
| Group
| OptionalArg
| InlienMath
| DisplayMath
| MathCharacter
| MatchingDelimiters
| MathDelimiters
| MathEnv
| MathEnvAligned
| Parbreak
| Space
| Softbreak
| Linebreak
| Superscript
| Subscript
| AlignmentTab
| CommandParameter
| ActiveCharacter
| Ignore
| Verb
| Verbatim
| Minted
| Lstlisting

export type Element = Exclude<Node, Space | Softbreak>

export function isElement(node: Node): node is Element {
    return !!node && !isSpace(node) && !isSoftbreak(node)
}

export type Comment = {
    kind: 'comment';
    content: string;
    location: Location;
}

export type AstRoot = {
    kind: 'ast.root';
    content: Node[];
    comment?: Comment[];
}

export function isAstRoot(ast: LatexAst): ast is AstRoot {
    return ast.kind === 'ast.root'
}

export type AstPreamble = {
    kind: 'ast.preamble';
    content: Node[];
    comment?: Comment[];
    rest: string;
}

export function isAstPreamble(ast: LatexAst): ast is AstPreamble {
    return ast.kind === 'ast.preamble'
}

export type LatexAst = AstRoot | AstPreamble
