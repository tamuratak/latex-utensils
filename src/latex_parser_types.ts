export type TextString = {
    kind: "text.string";
    content: string;
    location: Location;
}

export type Command = {
    kind: "command";
    name: string;
    args: (OptionalArg | Group)[];
    location: Location;
}

export type AmsMathTextCommand = {
    kind: "command.text";
    arg: Group;
    location: Location;
}

export type Environment = {
    kind: "env";
    name: string;
    args: (OptionalArg | Group)[];
    content: Node[];
    location: Location;
}

export type MathEnv = {
    kind: "env.math.align";
    name: string;
    content: Node[];
    location: Location;
}

export type MathEnvAligned = {
    kind: "env.math.aligned";
    name: string;
    content: Node[];
    location: Location;
}

export type Group = {
    kind: "arg.group";
    content: Node[];
    location: Location;
}

export type OptionalArg = {
    kind: "arg.optional";
    content: Node[];
    location: Location;
}

export type Pagebreak = {
    kind: "parbreak";
    location: Location;
}

export type Supescript = {
    kind: "superscript";
    content: Node[];
    location: Location;
}

export type Subscript = {
    kind: "subscript";
    content: Node[];
    location: Location;
}

export type Verb = {
    kind: "verb";
    escape: string;
    content: string;
    location: Location;
}

export type Verbatim = {
    kind: "env.verbatim";
    content: string;
    location: Location;
}

export type Minted = {
    kind: "env.minted";
    args: (OptionalArg | Group)[];
    content: string;
    location: Location;
}

export type InlienMath = {
    kind: "math.inline";
    content: Node[];
    location: Location;
}

export type DisplayMath = {
    kind: "math.display";
    content: Node[];
    location: Location;
}

export type Node
= TextString
| Command
| AmsMathTextCommand
| Environment
| Group
| OptionalArg
| InlienMath
| DisplayMath
| MathEnv
| MathEnvAligned
| Pagebreak
| Supescript
| Subscript
| Verb
| Verbatim
| Minted

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

export type Comment = {
    kind: "comment";
    content: string;
    location: Location;
}

export type AstRoot = {
    kind: 'ast.root';
    content: Node[];
    comment?: Comment[];
}

export type AstPreamble = {
    kind: 'ast.preamble';
    content: Node[];
    comment?: Comment[];
}

export type LatexAst = AstRoot | AstPreamble

export type ParserOptions = {
    startRule?: string;
    tracer?: Tracer;
    enableComment?: boolean;
}

export type TraceArg = {
    type: "rule.enter" | "rule.match" | "rule.fail";
    rule: string;
    result: string | Node;
    location: Location;
}

export type Tracer = {
    trace: (e: TraceArg) => any;
}

export class SyntaxError extends Error {
    message: string;
    expected: string | null;
    found: string | null;
    location: Location;
    name : 'SyntaxError';
}
