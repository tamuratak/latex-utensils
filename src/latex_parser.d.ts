type Node = {
    kind: string;
    content: (string | Node)[];
}

type Location = {
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

type Comment = {
    kind: "comment";
    content: string;
    location: Location;
}

type AST = {
    content: (string | Node)[];
    comment: Comment;
}

type ParserOptions = {
    startRule?: string;
    tracer: any;
}

export declare class SyntaxError extends Error {
  message: string;
  expected: string | null;
  found: string | null;
  location: Location;
  name : 'SyntaxError';
}

export declare function parse(input: string, options?: ParserOptions): AST;
