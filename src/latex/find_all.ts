import * as lp from './latex_parser_types'


export function findAll<T extends lp.Node>(nodes: lp.Node[], typeguard: (x: any) => x is T): T[] {
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
