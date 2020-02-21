import * as lp from './latex_parser_types'
import {Node} from './latex_parser_types'

type FindResult<T extends Node, P extends Node = Node> = {
    target: T;
    parent?: FindResult<P>;
}

export function findAll<T extends Node>(
    nodes: Node[],
    typeguard: ((x: Node) => x is T) | ((x: Node) => boolean) = (_z: Node): _z is T => true,
    parent?: FindResult<Node>
): FindResult<T>[] {
    let ret: FindResult<T>[] = []
    for(const node of nodes) {
        const cur = { target: node, parent }
        if (typeguard(node)) {
            ret.push({ target: node, parent })
        }
        if (lp.hasContentArray(node)) {
            ret = ret.concat(findAll(node.content, typeguard, cur))
        }
        if (lp.hasArgsArray(node)) {
            ret = ret.concat(findAll(node.args, typeguard, cur))
        }
        if ('arg' in node && node.arg) {
            ret = ret.concat(findAll([node.arg], typeguard, cur))
        }
    }
    return ret
}

type MatchResult<T extends Node, P extends Pattern<Node, any> | undefined> = {
    target: T;
    parent: P extends undefined ? undefined : MatchResult<NonNullable<P>['target'], NonNullable<P>['parentPattern']>;
}

export class Pattern<T extends Node, ParentPattern extends Pattern<Node, any> | undefined = undefined > {
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

    match(nodes: Node[]): MatchResult<T, ParentPattern>[] {
        const ret: MatchResult<T, ParentPattern>[] = []
        if (!this.parentPattern){
            const results = findAll(nodes, this.typeguard)
            for (const result of results) {
                ret.push( { target: result.target, parent: undefined as any } )
            }
        } else {
            const parentMatchResults = this.parentPattern.match(nodes)
            for(const parentMatchResult of parentMatchResults) {
                const parentNode = parentMatchResult.target
                let childNodes: Node[]
                if (lp.hasContentArray(parentNode)) {
                    childNodes = parentNode.content
                } else if (lp.hasArgsArray(parentNode)) {
                    childNodes = parentNode.args
                } else if ('arg' in parentNode && parentNode.arg) {
                    childNodes = [parentNode.arg]
                } else {
                    continue
                }
                for (const node of childNodes) {
                    if (this.typeguard(node)) {
                        ret.push( { target: node, parent: parentMatchResult as any } )
                    }
                }
            }
        }
        return ret
    }
}
