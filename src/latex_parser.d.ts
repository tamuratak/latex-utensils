type AnyNode = {
    kind: string;
    content?: any;
    name?: string;
}

type Command = {
    kind: "command";
    name: string;
    args: (OptionalArg | Group)[];
}

type Environment = {
    kind: "env";
    name: string;
    args: (OptionalArg | Group)[];
    content: (string | Node)[];
}

type MathEnv = {
    kind: "env.math.align";
    name: string;
    content: (string | Node)[];
}

type MathEnvAligned = {
    kind: "env.math.aligned";
    name: string;
    content: (string | Node)[];
}

type Group = {
    kind: "arg.group";
    content: (string | Node)[];
}

type OptionalArg = {
    kind: "arg.optional";
    content: (string | Node)[];
}

type Pagebreak = {
    kind: "parbreak";
}

type Supescript = {
    kind: "superscript";
    content: (string | Node)[];
}

type Subscript = {
    kind: "subscript";
    content: (string | Node)[];
}

type Verb = {
    kind: "verb";
    escape: string;
    content: string;
}

type Verbatim = {
    kind: "env.verbatim";
    content: string;
}

type InlienMath = {
    kind: "math.inline";
    content: (string | Node)[];
}

type DisplayMath = {
    kind: "math.display";
    content: (string | Node)[];
}

type Node
= Command
| Environment
| Group
| InlienMath
| DisplayMath
| MathEnv
| MathEnvAligned
| Pagebreak
| Supescript
| Subscript
| Verb
| Verbatim

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

type LatexAst = {
    content: (string | Node)[];
    comment: Comment[];
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

export declare function parse(input: string, options?: ParserOptions): LatexAst;
