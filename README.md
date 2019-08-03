# latex-utensils

[![latex-utensils](https://img.shields.io/npm/v/latex-utensils)](https://www.npmjs.com/package/latex-utensils)

A LaTeX parser and utilities.

The parser is based on the following libraries:

- https://github.com/michael-brade/LaTeX.js
- https://github.com/siefkenj/latex-parser

## Usage

You can see AST as follows. Without the option `-i`, you can obtain the output as JSON format.

```
$ cat sample/t.tex
\documentclass{article}
\usepackage{amsmath}
\begin{document}
  abc $x+y$ d
  \begin{align}
    a + b
  \end{align}
\end{document}

$ luparse --color -i sample/t.tex
{ kind: 'ast.root',
  content:
   [ { kind: 'command',
       name: 'documentclass',
       args:
        [ { kind: 'arg.group',
            content: [ { kind: 'text.string', content: 'article' } ] } ] },
     { kind: 'command',
       name: 'usepackage',
       args:
        [ { kind: 'arg.group',
            content: [ { kind: 'text.string', content: 'amsmath' } ] } ] },
     { kind: 'env',
       name: 'document',
       args: [],
       content:
        [ { kind: 'text.string', content: 'abc' },
          { kind: 'inlineMath',
            content:
             [ { kind: 'math.character', content: 'x' },
               { kind: 'math.character', content: '+' },
               { kind: 'math.character', content: 'y' } ] },
          { kind: 'text.string', content: 'd' },
          { kind: 'env.math.align',
            name: 'align',
            args: [],
            content:
             [ { kind: 'math.character', content: 'a' },
               { kind: 'math.character', content: '+' },
               { kind: 'math.character', content: 'b' } ] },
          { kind: 'parbreak' } ] } ],
  comment: undefined }

$ luparse --help
Usage: luparse [options]

Options:
  -i, --inspect            use util.inspect to output AST
  --color                  turn on the color option of util.inspect
  -l, --location           enable location
  -c, --comment            enable comment
  -s, --start-rule [rule]  set start rule. default is "Root".
  -h, --help               output usage information
```

## API

```typescript
import {latexParser} from 'latex-utensils';
const texString = '\\begin{document}abc\\end{document}';
const ast = latexParser.parse(texString);
console.log(JSON.stringify(ast, undefined, '  '));
```

### `latexParser.parse(texString, options?): AstRoot | AstPreamble`

#### Parameters

* `texString: string`
* `options?: { startRule?: 'Root' | 'Preamble'; enableComment?: boolean; }` — `startRule` specifies a rule with which the parser begins. If `'Root'` is set, the whole document is parsed. If `'Preamble'` is set, only the preamble is parsed. The default is `'Root'`. If `enableComment` is true, all the comments in the `texString` will be extracted into a returned AST also. The default is `false`.

#### Returns

If the startRule is `Root`, an `AstRoot` object is returned.

```typescript
type AstRoot = {
    kind: 'ast.root';
    content: Node[];
    comment?: Comment[];
}
```

If the startRule is `Preamble`, an `AstPreamble` object is returned.

```typescript
type AstPreamble = {
    kind: 'ast.preamble';
    content: Node[];
    comment?: Comment[];
    rest: string;
}
```

For the details of `Node` and `Comment`, please see [src/latex_parser_types.ts](https://github.com/tamuratak/latex-utensils/blob/master/src/latex_parser_types.ts).


### `latexParser.parsePreamble(texString): AstPreamble`

Equivalent to `latexParser.parse(texString, {startRule: 'Preamble'})`.

### `latexParser.stringify(node: Node | Node[], options = { lineBreak: '' }): string`

Convert AST to a string.

### `latexParser.isSyntaxError(e: any): boolean`

A Type Guard for SyntaxError thrown by `latexParser.parse`.
