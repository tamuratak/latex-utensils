import {Node} from './latex_parser_types'
import {find, findAll, getChildNodes} from './find_all'


/**
 * A matcher result.
 */
export type MatchResult<T extends Node, P extends Pattern<Node, any> | undefined> = {
    /**
     * The matched node.
     */
    node: T;
    /**
     * The parent node of the matched node.
     */
    parent: P extends undefined ? undefined : MatchResult<NonNullable<P>['target'], NonNullable<P>['parentPattern']>;
}

export type MatchOptions = {
    /**
     * If `true`, the pattern matching can begin within child nodes given
     * to {@link Pattern.match} and {@link Pattern.matchAll}.
     *
     * @default false
     *
     * @example
```ts
const texString = 'a $x + y$ b'
const ast = lp.parse(texString)
const pat = lp.pattern(lp.isMathCharacter)
const result = pat.match(ast.content) // undefined
```
     * @example
```ts
const texString = 'a $x + y$ b'
const ast = lp.parse(texString)
const pat = lp.pattern(lp.isMathCharacter)
const result = pat.match(ast.content, {traverseAll: true})
result?.node.content // 'x'
```
     */
    traverseAll: boolean
}

/**
 * @example
```ts
import {latexParser as lp} from 'latex-utensils'

const texString = 'a $x + y$ b'
const ast = lp.parse(texString)
const childPat = lp.pattern(lp.isInlienMath).child(lp.isMathCharacter)
const result = childPat.match(ast.content)
result?.node.content // 'x'
```
 */
export class Pattern<T extends Node, ParentPattern extends Pattern<Node, any> | undefined = undefined > {
    /**
     * Type guard to check whether nodes match.
     */
    readonly typeguard: ((x: Node) => x is T) | ((x: Node) => boolean)
    /**
     * Parent pattern.
     */
    readonly parentPattern: ParentPattern
    /** @ignore */
    target: T

    /** @ignore */
    constructor(
        typeguard: ((x: Node) => x is T) | ((x: Node) => boolean),
        parentPattern: ParentPattern
    ) {
        this.typeguard = typeguard
        this.parentPattern = parentPattern
     }

    /**
     * Returns a pattern whose parent pattern is `this`. The pattern matches if `typeguard` returns `true`.
     * @param typeguard A type guard of the child pattern.
     */
    child<C extends Node>(typeguard: ((x: Node) => x is C) ): Pattern<C, Pattern<T, ParentPattern>>
    /**
     * Returns a pattern whose parent pattern is `this`. The pattern matches if `typeguard` returns `true`.
     * @param typeguard A callback of the child pattern.
     */
    child(typeguard: ((x: Node) => boolean) ): Pattern<Node, Pattern<T, ParentPattern>>
    child(typeguard: ((x: Node) => boolean) ): Pattern<Node, Pattern<T, ParentPattern>> {
        const childMatcher = new Pattern(typeguard, this)
        return childMatcher
    }

    /**
     * Returns a node in the child nodes if matched. Returns `undefined` if not matched.
     * Its parent node must match its {@link parentPattern}.
     *
     * @param nodes Array of nodes to search.
     * @param opt Options of search.
     */
    match(
        nodes: Node[],
        opt: MatchOptions = { traverseAll: false }
    ): MatchResult<T, ParentPattern> | undefined {
        if (!this.parentPattern){
            if (opt.traverseAll) {
                const result = find(nodes, this.typeguard)
                if (result) {
                    return { node: result.node, parent: undefined as any }
                }
            } else {
                for (const node of nodes) {
                    if (this.typeguard(node)) {
                        return { node, parent: undefined as any }
                    }
                }
            }
        } else {
            const parentMatchResults = this.parentPattern.matchAll(nodes, opt)
            for(const parentMatchResult of parentMatchResults) {
                const parentNode = parentMatchResult.node
                const childNodes = getChildNodes(parentNode)
                for (const node of childNodes) {
                    if (this.typeguard(node)) {
                        return { node, parent: parentMatchResult as any }
                    }
                }
            }
        }
        return undefined
    }

    /**
     * Returns the array of all the matched node. Returns an empty array if not matched.
     * Their parent node must match {@link parentPattern}.
     * @param nodes Array of nodes to search.
     * @param opt Options of search.
     */
    matchAll(
        nodes: Node[],
        opt: MatchOptions = { traverseAll: false }
    ): MatchResult<T, ParentPattern>[] {
        const ret: MatchResult<T, ParentPattern>[] = []
        if (!this.parentPattern){
            if (opt.traverseAll) {
                const results = findAll(nodes, this.typeguard)
                for (const result of results) {
                    ret.push( { node: result.node, parent: undefined as any } )
                }
            } else {
                for (const node of nodes) {
                    if (this.typeguard(node)) {
                        ret.push( { node, parent: undefined as any })
                    }
                }
            }
        } else {
            const parentMatchResults = this.parentPattern.matchAll(nodes, opt)
            for(const parentMatchResult of parentMatchResults) {
                const parentNode = parentMatchResult.node
                const childNodes = getChildNodes(parentNode)
                for (const node of childNodes) {
                    if (this.typeguard(node)) {
                        ret.push( { node, parent: parentMatchResult as any } )
                    }
                }
            }
        }
        return ret
    }
}

/**
 * Returns a pattern. The pattern matches if `typeguard` returns `true`.
 * @param typeguard Type guard to check whether nodes match.
 */
export function pattern<T extends Node>(typeguard: ((x: Node) => x is T)): Pattern<T, undefined>
/**
 * Returns a pattern. The pattern matches if `typeguard` returns `true`.
 * @param typeguard Type guard to check whether nodes match.
 */
export function pattern(typeguard: ((x: Node) => boolean)): Pattern<Node, undefined>
export function pattern(typeguard: ((x: Node) => boolean)): Pattern<Node, undefined> {
    return new Pattern(typeguard, undefined)
}
