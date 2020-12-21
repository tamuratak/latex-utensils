import { TimeKeeper } from './timeout'

export type Location = {
    start: {
        /**
         * The zero-based offset value.
         */
        offset: number;
        /**
         * The one-based line value.
         */
        line: number;
        /**
         * The one-based column value.
         */
        column: number;
    };
    end: {
        /**
         * The zero-based offset value.
         */
        offset: number;
        /**
         * The one-based line value.
         */
        line: number;
        /**
         * The one-based column value.
         */
        column: number;
    };
}

export function isLocation(x: any): x is Location {
    const ret =
    x?.start?.offset !== undefined &&
    x?.start?.line !== undefined &&
    x?.start?.column !== undefined &&
    x?.end?.offset !== undefined &&
    x?.end?.line !== undefined &&
    x?.end?.column !== undefined
    return ret
}

export class SyntaxErrorBase extends Error {
    message: string
    expected: string | null
    found: string | null
    location: Location
    name: 'SyntaxError'
}

export class SyntaxError extends SyntaxErrorBase {}

export function isSyntaxError(x: any): x is SyntaxError {
    const ret = x?.message !== undefined && isLocation(x?.location) && x?.name === 'SyntaxError' && x instanceof Error
    return ret
}

export type ParserOptions = {
    startRule?: string;
    tracer?: Tracer;
    enableComment?: boolean;
    enableMathCharacterLocation?: boolean;
    timeout?: number | TimeKeeper;
}

export type TraceArg = {
    type: 'rule.enter' | 'rule.match' | 'rule.fail';
    rule: string;
    result: any;
    location: Location;
}

export type Tracer = {
    trace: (e: TraceArg) => any;
}
