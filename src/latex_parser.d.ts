type AnyNode = {
    kind: string;
    content?: any;
    name?: string;
}

type TextString = {
    kind: "text.string";
    content: string;
    location: Location;
}

type Command = {
    kind: "command";
    name: string;
    args: (OptionalArg | Group)[];
    location: Location;
}

type AmsMathTextCommand = {
    kind: "command.text";
    arg: Group;
    location: Location;
}

type Environment = {
    kind: "env";
    name: string;
    args: (OptionalArg | Group)[];
    content: Node[];
    location: Location;
}

type MathEnv = {
    kind: "env.math.align";
    name: string;
    content: Node[];
    location: Location;
}

type MathEnvAligned = {
    kind: "env.math.aligned";
    name: string;
    content: Node[];
    location: Location;
}

type Group = {
    kind: "arg.group";
    content: Node[];
    location: Location;
}

type OptionalArg = {
    kind: "arg.optional";
    content: Node[];
    location: Location;
}

type Pagebreak = {
    kind: "parbreak";
    location: Location;
}

type Supescript = {
    kind: "superscript";
    content: Node[];
    location: Location;
}

type Subscript = {
    kind: "subscript";
    content: Node[];
    location: Location;
}

type Verb = {
    kind: "verb";
    escape: string;
    content: string;
    location: Location;
}

type Verbatim = {
    kind: "env.verbatim";
    content: string;
    location: Location;
}

type Minted = {
    kind: "env.minted";
    args: (OptionalArg | Group)[];
    content: string;
    location: Location;
}

type InlienMath = {
    kind: "math.inline";
    content: Node[];
    location: Location;
}

type DisplayMath = {
    kind: "math.display";
    content: Node[];
    location: Location;
}

type Node
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

type AstRoot = {
    kind: 'ast.root';
    content: Node[];
    comment?: Comment[];
}

type AstPreamble = {
    kind: 'ast.preamble';
    content: Node[];
    comment?: Comment[];
}

type LatexAst = AstRoot | AstPreamble

type ParserOptions = {
    startRule?: string;
    tracer?: Tracer;
    enableComment?: boolean;
}

type TraceArg = {
    type: "rule.enter" | "rule.match" | "rule.fail";
    rule: string;
    result: string | Node;
    location: Location;
}

type Tracer = {
    trace: (e: TraceArg) => any;
}

export declare class SyntaxError extends Error {
  message: string;
  expected: string | null;
  found: string | null;
  location: Location;
  name : 'SyntaxError';
}

export declare function parse(input: string, options?: ParserOptions): LatexAst;
