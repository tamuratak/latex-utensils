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
