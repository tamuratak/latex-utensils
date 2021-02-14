# latex-utensils v4

[![latex-utensils](https://img.shields.io/npm/v/latex-utensils)](https://www.npmjs.com/package/latex-utensils)
[![CI Tests](https://github.com/tamuratak/latex-utensils/workflows/CI%20Tests/badge.svg)](https://github.com/tamuratak/latex-utensils/actions)

A LaTeX parser and utilities.

The parser is based on the following libraries:

- https://github.com/michael-brade/LaTeX.js
- https://github.com/siefkenj/latex-parser

## Getting started

You can see LaTeX AST calling the `luparse` command. Without the option `-i`, you can obtain the output as JSON format.

```
$ cat sample/t.tex
\documentclass{article}
\usepackage{amsmath}
\begin{document}
ab c
d $x + y$ e
\begin{align}
    i + j
\end{align}
\end{document}

$ luparse --color -i sample/t.tex
{
  kind: 'ast.root',
  content: [
    {
      kind: 'command',
      name: 'documentclass',
      args: [
        {
          kind: 'arg.group',
          content: [ { kind: 'text.string', content: 'article' } ]
        }
      ]
    },
    { kind: 'softbreak' },
    {
      kind: 'command',
      name: 'usepackage',
      args: [
        {
          kind: 'arg.group',
          content: [ { kind: 'text.string', content: 'amsmath' } ]
        }
      ]
    },
    {
      kind: 'env',
      name: 'document',
      args: [],
      content: [
        { kind: 'text.string', content: 'ab' },
        { kind: 'space' },
        { kind: 'text.string', content: 'c' },
        { kind: 'softbreak' },
        { kind: 'text.string', content: 'd' },
        { kind: 'space' },
        {
          kind: 'inlineMath',
          content: [
            { kind: 'math.character', content: 'x' },
            { kind: 'math.character', content: '+' },
            { kind: 'math.character', content: 'y' }
          ]
        },
        { kind: 'space' },
        { kind: 'text.string', content: 'e' },
        {
          kind: 'env.math.align',
          name: 'align',
          args: [],
          content: [
            { kind: 'math.character', content: 'i' },
            { kind: 'math.character', content: '+' },
            { kind: 'math.character', content: 'j' }
          ]
        }
      ]
    }
  ],
  comment: undefined
}

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

## Usage

A typical usage is calling [`latexParser.parse`](https://tamuratak.github.io/latex-utensils/modules/main.latexparser.html#parse) to parse LaTeX documents.

```typescript
import {latexParser} from 'latex-utensils';
const texString = 'a $x+y$ b';
const ast = latexParser.parse(texString);
console.log(JSON.stringify(ast, undefined, '  '));
```

[`latexParser.parse`](https://tamuratak.github.io/latex-utensils/modules/main.latexparser.html#parse) returns an [`AstRoot`](https://tamuratak.github.io/latex-utensils/modules/latex_latex_parser_types.html#astroot) object if [`startRule`](https://tamuratak.github.io/latex-utensils/interfaces/main.latexparser.parseroptions.html#startrule) is `'Root'`,

```typescript
type AstRoot = {
    kind: 'ast.root';
    content: Node[];
    comment?: Comment[];
}
```

## Docs

- https://tamuratak.github.io/latex-utensils/

## Repository

- https://github.com/tamuratak/latex-utensils

## Development

To lint changes, run

    npm run lint

To build, run

    npm run build

To test, run

    npm run test
