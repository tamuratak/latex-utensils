import * as lp from './latex_parser_types'
import {Node} from './latex_parser_types'


export function findAll<T extends Node>(
    nodes: Node[],
    typeguard: (x: Node) => x is T = (z: Node): z is T => z as any || true
): T[] {
    let ret: T[] = []
    for(const node of nodes) {
        if (typeguard(node)) {
            ret.push(node)
        }
        if (lp.hasContentArray(node)) {
            ret = ret.concat(findAll(node.content, typeguard))
        }
        if (lp.hasArgsArray(node)) {
            ret = ret.concat(findAll(node.args, typeguard))
        }
        if ('arg' in node && node.arg) {
            ret = ret.concat(findAll([node.arg], typeguard))
        }
    }
    return ret
}

export class Matcher<T extends Node> {
    parentMatcher?: Matcher<Node>
    childMatcher?: Matcher<Node>

    constructor(readonly typeguard: (x: Node) => x is T) {

    }

    child<C extends Node>(typeguard: (x: Node) => x is C): Matcher<C> {
        const childMatcher = new Matcher(typeguard)
        childMatcher.parentMatcher = this
        this.childMatcher = childMatcher
        return childMatcher
    }

    parent<P extends Node>(typeguard: (x: Node) => x is P): Matcher<P> {
        const parentMatcher = new Matcher(typeguard)
        parentMatcher.childMatcher = this
        this.parentMatcher = parentMatcher
        return parentMatcher
    }

}
