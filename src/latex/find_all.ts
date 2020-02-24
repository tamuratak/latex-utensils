import * as lp from './latex_parser_types'
import {Node} from './latex_parser_types'

type Typegurad<T extends Node> = ((x: Node) => x is T) | ((x: Node) => boolean)

export function getChildNodes(node: Node): Node[] {
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

type SequenceResult<Ts extends Node[], P extends Node = Node> = {
    nodes: Ts;
    parent?: FindResult<P>;
}

export function findAllSequences<T extends Node>(
    nodes: Node[],
    typeguards: [Typegurad<T>],
    parent?: FindResult<Node>
): SequenceResult<[T]>[]
export function findAllSequences<T1 extends Node, T2 extends Node>(
    nodes: Node[],
    typeguards: [Typegurad<T1>, Typegurad<T2>],
    parent?: FindResult<Node>
): SequenceResult<[T1, T2]>[]
export function findAllSequences(
    nodes: Node[],
    typeguards: Typegurad<Node>[],
    parent?: FindResult<Node>
): SequenceResult<Node[]>[]
export function findAllSequences(
    nodes: Node[],
    typeguards: Typegurad<Node>[],
    parent?: FindResult<Node>
): SequenceResult<Node[]>[] {
    let ret: SequenceResult<Node[]>[] = []
    for(let i = 0; i < nodes.length; i++) {
        let flag = true
        const curResult: Node[] = []
        for (let j = 0; j < typeguards.length; j++) {
            if (i+j < nodes.length) {
                const cur = nodes[i+j]
                if (typeguards[j](cur)) {
                    curResult.push(cur)
                    continue
                }
            }
            flag = false
            break
        }
        if (flag) {
            ret.push( {nodes: curResult, parent})
        }
        const curNode = nodes[i]
        const cur = { node: curNode, parent }
        const childNodes = getChildNodes(curNode)
        ret = ret.concat(findAllSequences(childNodes, typeguards, cur))
    }
    return ret
}

type Position = {
    line: number;
    column: number;
    offset?: number;
    includeStart?: boolean;
    includeEnd?: boolean;
} | {
    line?: number;
    column?: number;
    offset: number;
    includeStart?: boolean;
    includeEnd?: boolean;
}

export function findNodeAt(
    nodes: Node[],
    pos: Position,
    parent?: FindResult<Node>
): FindResult<Node> | undefined {
    for (const node of nodes) {
        const nodeLoc = node.location
        const cur = { node, parent }
        if (nodeLoc && pos.line !== undefined && pos.column !== undefined
            && nodeLoc.start.line <= pos.line
            && (pos.includeStart ? nodeLoc.start.column <= pos.column : nodeLoc.start.column < pos.column)
            && nodeLoc.end.line >= pos.line
            && (pos.includeEnd ? nodeLoc.end.column >= pos.column : nodeLoc.end.column > pos.column) ) {
            const childNodes = getChildNodes(node)
            return findNodeAt(childNodes, pos, cur)
        } else if (nodeLoc && pos.offset !== undefined
            && (pos.includeStart ? nodeLoc.start.offset <= pos.offset : nodeLoc.start.offset < pos.offset)
            && (pos.includeEnd ? nodeLoc.end.offset >= pos.offset : nodeLoc.end.offset > pos.offset) ) {
            const childNodes = getChildNodes(node)
            return findNodeAt(childNodes, pos, cur)
        }
    }
    return parent
}
