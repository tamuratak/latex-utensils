import {Node} from './latex_parser_types'
import {find, findAll, getChildNodes} from './find_all'


type MatchResult<T extends Node, P extends Pattern<Node, any> | undefined> = {
    node: T;
    parent: P extends undefined ? undefined : MatchResult<NonNullable<P>['target'], NonNullable<P>['parentPattern']>;
}

export class Pattern<T extends Node, ParentPattern extends Pattern<Node, any> | undefined = undefined > {
    /** @ignore */
    readonly parentPattern: ParentPattern
    /** @ignore */
    target: T

    /**
     * @ignore
     */
    constructor(
        private readonly typeguard: ((x: Node) => x is T) | ((x: Node) => boolean),
        parentPattern: ParentPattern
    ) {
        this.parentPattern = parentPattern
    }

    /**
     *
     * @param typeguard
     */
    child<C extends Node>(
        typeguard: ((x: Node) => x is C) | ((x: Node) => boolean)
    ): Pattern<C, Pattern<T, ParentPattern>> {
        const childMatcher = new Pattern(typeguard, this)
        return childMatcher
    }

    /**
     *
     * @param nodes
     * @param opt
     */
    match(
        nodes: Node[],
        opt: { traverseAll: boolean } = { traverseAll: false }
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
     *
     * @param nodes
     * @param opt
     */
    matchAll(
        nodes: Node[],
        opt: { traverseAll: boolean } = { traverseAll: false }
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

export function pattern<T extends Node>(typeguard: ((x: Node) => x is T) | ((x: Node) => boolean)) {
    return new Pattern(typeguard, undefined)
}
