import {ParserOptions} from '../pegjs/pegjs_types'
import {TimeKeeper} from '../pegjs/timeout'

type ParseFunc<T> = (s: string, _option?: ParserOptions) => T

export function parse<T>(
    s: string,
    _option: ParserOptions | undefined,
    parseOnly: ParseFunc<T>,
    parseWithTracer: ParseFunc<T>
): ReturnType<ParseFunc<T>> {
    const option = _option ? Object.assign({}, _option) : undefined
    if (option && option.timeout) {
        if (typeof option.timeout !== 'object') {
            option.timeout = new TimeKeeper(option.timeout)
        }
    }
    if (option && option.tracer) {
        return parseWithTracer(s, option)
    } else {
        return parseOnly(s, option)
    }
}
