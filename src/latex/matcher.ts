import {Node} from './latex_parser_types'
import {findAll, getChildNodes} from './find_all'


type MatchResult<T extends Node, P extends Pattern<Node, any> | undefined> = {
    node: T;
    parent: P extends undefined ? undefined : MatchResult<NonNullable<P>['target'], NonNullable<P>['parentPattern']>;
}

class Pattern<T extends Node, ParentPattern extends Pattern<Node, any> | undefined = undefined > {
    parentPattern: ParentPattern
    target: T

    constructor(
        readonly typeguard: ((x: Node) => x is T) | ((x: Node) => boolean),
        parentPattern?: ParentPattern
    ) {
        this.parentPattern = parentPattern || this.parentPattern
    }

    child<C extends Node>(
        typeguard: ((x: Node) => x is C) | ((x: Node) => boolean)
    ): Pattern<C, Pattern<T, ParentPattern>> {
        const childMatcher = new Pattern(typeguard, this)
        return childMatcher
    }

    matchAll(nodes: Node[], opt: { traverseAll: boolean } = { traverseAll: false } ): MatchResult<T, ParentPattern>[] {
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
    return new Pattern(typeguard)
}
