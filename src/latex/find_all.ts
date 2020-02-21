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

type MatchResult<T extends Node, P extends Pattern<Node, any> | undefined = any> = {
    target: T;
    parent?: MatchResult<NonNullable<P>['target'], NonNullable<NonNullable<P>['parentPattern']>>;
}

export class Pattern<T extends Node, ParentPattern extends Pattern<Node, any> | undefined = undefined > {
    parentPattern?: ParentPattern
    target: T

    constructor(
        readonly typeguard: ((x: Node) => x is T) | ((x: Node) => boolean),
        parentPattern?: ParentPattern
    ) {
        this.parentPattern = parentPattern
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
                ret.push( { target: result.target, parent: undefined } )
            }
        } else {
            const parentMatchResults = this.parentPattern.match(nodes)
            for(const parentMatchResult of parentMatchResults) {
                const node = parentMatchResult.target
                let results: FindResult<T, lp.Node>[] | undefined
                if (lp.hasContentArray(node)) {
                    results = findAll(node.content, this.typeguard)
                } else if (lp.hasArgsArray(node)) {
                    results = findAll(node.args, this.typeguard)
                } else if ('arg' in node && node.arg) {
                    results = findAll([node.arg], this.typeguard)
                }
                if (results) {
                    for (const result of results) {
                        ret.push( { target: result.target, parent: parentMatchResult } )
                    }
                }
            }
        }
        return ret
    }
}

const pat = new Pattern(lp.isCommand).child(lp.isGroup).child(lp.isTextString)
const results = pat.match([])
for ( const result of results ) {
    const p = result.parent?.parent?.target
    console.log(p)
}
