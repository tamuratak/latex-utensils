# latex-utensils

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
