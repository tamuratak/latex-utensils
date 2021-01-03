import * as lp from './latex_parser_types'
import {Node} from './latex_parser_types'

export type Typeguard<T extends Node> = ((x: Node) => x is T) | ((x: Node) => boolean)

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

export type FindResult<T extends Node, P extends Node = Node> = {
    /**
     * The matched node.
     */
    node: T;
    /**
     * The parent node of the matched node.
     */
    parent?: FindResult<P>;
}

/**
 * Find a node satisfying `typeguard` in `nodes` traversely.
 * @param nodes The array of nodes where to be searched.
 * @param typeguard If this is actually a type guard, the matched result will be typed.
 * @param parent internal-use only.
 */
export function find<T extends Node>(
    nodes: Node[],
    typeguard: Typeguard<T> = (_z: Node): _z is T => true,
    parent?: FindResult<Node>
): FindResult<T> | undefined {
    for(const node of nodes) {
        if (typeguard(node)) {
            return { node, parent }
        }
        const cur = { node, parent }
        const childNodes = getChildNodes(node)
        if (childNodes.length > 0) {
            return find(childNodes, typeguard, cur)
        }
    }
    return undefined
}

/**
 * Find all the nodes satisfying `typeguard` in `nodes` traversely.
 * @param nodes The array of nodes where to be searched.
 * @param typeguard If this is actually a type guard, the matched result will be typed.
 * @param parent internal-use only.
 */
export function findAll<T extends Node>(
    nodes: Node[],
    typeguard: Typeguard<T> = (_z: Node): _z is T => true,
    parent?: FindResult<Node>
): FindResult<T>[] {
    let ret: FindResult<T>[] = []
    for(const node of nodes) {
        if (typeguard(node)) {
            ret.push({ node, parent })
        }
        const cur = { node, parent }
        const childNodes = getChildNodes(node)
        if (childNodes.length > 0) {
            ret = ret.concat(findAll(childNodes, typeguard, cur))
        }
    }
    return ret
}

export type SequenceResult<Ts extends Node[], P extends Node = Node> = {
    nodes: Ts;
    parent?: FindResult<P>;
}

/** @ignore */
export function findAllSequences<T extends Node>(
    nodes: Node[],
    typeguards: [Typeguard<T>],
    parent?: FindResult<Node>
): SequenceResult<[T]>[]
/** @ignore */
export function findAllSequences<T1 extends Node, T2 extends Node>(
    nodes: Node[],
    typeguards: [Typeguard<T1>, Typeguard<T2>],
    parent?: FindResult<Node>
): SequenceResult<[T1, T2]>[]
/** @ignore */
export function findAllSequences<T1 extends Node, T2 extends Node, T3 extends Node>(
    nodes: Node[],
    typeguards: [Typeguard<T1>, Typeguard<T2>, Typeguard<T3>],
    parent?: FindResult<Node>
): SequenceResult<[T1, T2, T3]>[]
/** @ignore */
export function findAllSequences<T1 extends Node, T2 extends Node, T3 extends Node, T4 extends Node>(
    nodes: Node[],
    typeguards: [Typeguard<T1>, Typeguard<T2>, Typeguard<T3>, Typeguard<T4>],
    parent?: FindResult<Node>
): SequenceResult<[T1, T2, T3, T4]>[]
/** @ignore */
export function findAllSequences<T1 extends Node, T2 extends Node, T3 extends Node, T4 extends Node, T5 extends Node>(
    nodes: Node[],
    typeguards: [Typeguard<T1>, Typeguard<T2>, Typeguard<T3>, Typeguard<T4>, Typeguard<T5>],
    parent?: FindResult<Node>
): SequenceResult<[T1, T2, T3, T4, T5]>[]
/**
 * Find all the sequences of nodes satisfying `typeguard[]` in `nodes` traversely.
 * @param nodes The array of nodes where to be searched.
 * @param typeguards The array of `typeguard`s. Each node must satisfy each `typeguard`, respectively.
 *                   If this is actually a type guard, the matched result will be typed.
 * @param parent internal-use only.
 */
export function findAllSequences(
    nodes: Node[],
    typeguards: Typeguard<Node>[],
    parent?: FindResult<Node>
): SequenceResult<Node[]>[]
export function findAllSequences(
    nodes: Node[],
    typeguards: Typeguard<Node>[],
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
        if (childNodes.length > 0) {
            ret = ret.concat(findAllSequences(childNodes, typeguards, cur))
        }
    }
    return ret
}

/**
 * Gives priority to line and column over offset.
 */
export type Position = PositionLc | PositionOs

export type PositionLc = {
    /**
     * The one-based line value.
     */
    line: number;
    /**
     * The one-based column value.
     */
    column: number;
    /**
     * The zero-based offset value.
     */
    offset?: number;
    includeStart?: boolean;
    includeEnd?: boolean;
}

export type PositionOs = {
    /**
     * The one-based line value.
     */
    line?: number;
    /**
     * The one-based column value.
     */
    column?: number;
    /**
     * The zero-based offset value.
     */
    offset: number;
    includeStart?: boolean;
    includeEnd?: boolean;
}

/**
 * Find a node at the position.
 * @param nodes The array of nodes where to be searched
 * @param pos
 * @param parent internal-use only
 */
export function findNodeAt(
    nodes: Node[],
    pos: Position,
    parent?: FindResult<Node>
): FindResult<Node> | undefined {
    for (const node of nodes) {
        const nodeLoc = node.location
        const cur = { node, parent }
        if (nodeLoc && pos.line !== undefined && pos.column !== undefined) {
            const childNodes = getChildNodes(node)
            if (pos.line < nodeLoc.start.line || nodeLoc.end.line < pos.line) {
                continue
            }
            if ( nodeLoc.start.line === pos.line ) {
                if ( (pos.includeStart ? pos.column < nodeLoc.start.column : pos.column <= nodeLoc.start.column) ) {
                    continue
                }
            }
            if (nodeLoc.end.line === pos.line) {
                if ( (pos.includeEnd ? nodeLoc.end.column < pos.column : nodeLoc.end.column <= pos.column) ) {
                    continue
                }
            }
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
