import { TimeKeeper } from './timeout'

export type Location = {
    start: {
        offset: number;
        line: number;
        column: number;
    };
    end: {
        offset: number;
        line: number;
        column: number;
    };
}

export class SyntaxErrorBase extends Error {
    message: string
    expected: string | null
    found: string | null
    location: Location
    name: 'SyntaxError'
}

export type ParserOptions = {
    startRule?: string;
    tracer?: Tracer;
    enableComment?: boolean;
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
