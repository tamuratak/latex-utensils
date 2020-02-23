import * as lp from './latex_parser_types'
import {Node} from './latex_parser_types'


function getChildNodes(node: Node): Node[] {
    let results: Node[] = []
    if (lp.hasContentArray(node)) {
        results = results.concat(node.content)
    }
    if (lp.hasArgsArray(node)) {
        results = results.concat(node.args)
    }
    if ('arg' in node && node.arg) {
        results = results.concat([node.arg])
    }
    return results
}

type FindResult<T extends Node, P extends Node = Node> = {
    node: T;
    parent?: FindResult<P>;
}

export function findAll<T extends Node>(
    nodes: Node[],
    typeguard: ((x: Node) => x is T) | ((x: Node) => boolean) = (_z: Node): _z is T => true,
    parent?: FindResult<Node>
): FindResult<T>[] {
    let ret: FindResult<T>[] = []
    for(const node of nodes) {
        if (typeguard(node)) {
            ret.push({ node, parent })
        }
        const cur = { node, parent }
        const childNodes = getChildNodes(node)
        ret = ret.concat(findAll(childNodes, typeguard, cur))
    }
    return ret
}

export function findNodeAt(
    nodes: Node[],
    pos: { line: number; column: number; offset?: number } | { line?: number; column?: number; offset: number },
    parent?: FindResult<Node>
): FindResult<Node> | undefined {
    for (const node of nodes) {
        const nodeLoc = node.location
        const cur = { node, parent }
        if (nodeLoc && pos.line !== undefined && pos.column !== undefined
            && nodeLoc.start.line <= pos.line
            && nodeLoc.start.column <= pos.column
            && nodeLoc.end.line >= pos.line
            && nodeLoc.end.column >= pos.column) {
            const childNodes = getChildNodes(node)
            return findNodeAt(childNodes, pos, cur)
        } else if (nodeLoc && pos.offset !== undefined
            && nodeLoc.start.offset <= pos.offset
            && nodeLoc.end.offset >= pos.offset) {
            const childNodes = getChildNodes(node)
            return findNodeAt(childNodes, pos, cur)
        }
    }
    return parent
}

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

    match(nodes: Node[], opt: { traverseAll: boolean } = { traverseAll: false } ): MatchResult<T, ParentPattern>[] {
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
            const parentMatchResults = this.parentPattern.match(nodes, opt)
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
