/*

MIT License

Copyright (c) 2015-2019 Michael Brade, Jason Siefken

Copyright (c) 2019 Takashi Tamura

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

https://github.com/michael-brade/LaTeX.js
https://github.com/siefkenj/latex-parser

*/

{
  const commentMap = options.enableComment ? new Map() : undefined;
}

root
  = skip_space x:(element)*
  { 
    const comment = commentMap ? Array.from(commentMap.values()) : undefined;
    return { kind: "ast.root", content: x, comment };
  }

preamble
  = skip_space
  x:(!(escape "begin{document}") e:element { return e; })*
  rest:$(( escape "begin{document}" .* )?)
  {
    const comment = commentMap ? Array.from(commentMap.values()) : undefined;
    return { kind: "ast.preamble", content: x, rest, comment };
  }

element
  = x:element_p skip_space
  { 
    return x;
  }

element_p
  = SpecialCommand
  / break { return { kind: "parbreak", location: location() }; }
  / command
  / group
  / InlineMathShift
  / AlignmentTab
  / CommandParameterWithNumber
  / Superscript
  / Subscript
  / ignore
  / c:$((!noncharToken . )+) { return { kind: "text.string", content: c, location: location() }; }

MathElement =
  x:MathElement_p skip_space
  { 
    return x;
  }

MathElement_p
  = MathAlignedEnvironment
  / AmsmathTextCommand
  / SpecialCommand
  / math_matching_paren
  / command
  / math_group
  / AlignmentTab
  / CommandParameterWithNumber
  / Superscript skip_space x:MathElement { return { kind: "superscript", content: x, location: location() }; }
  / Subscript skip_space x:MathElement { return { kind: "subscript", content: x, location: location() }; }
  / ignore
  / c:. { return { kind: "math.character", content: c}; }

noncharToken
  = escape
  / "%"
  / beginGroup
  / endGroup
  / math_shift
  / AlignmentTab
  / nl
  / commandParameter
  / Superscript
  / Subscript
  / ignore
  / sp
  / EOF

number
  = $(num+ "." num+)
  / $("." num+)
  / $(num+ ".")
  / $(num+)

// for the special commands like \[ \] and \begin{} \end{} etc.
SpecialCommand "special command"
  = Verb
  / Verbatim
  / Minted
  / commentenv
  / DisplayMath
  / InlineMathParen
  / math_environment
  / environment

// \verb|xxx|
Verb
  = escape "verb" e:.
      x:$((!(end:. & {return end === e;}) . )*)
    (end:. & {return end === e;})
  {
    return { kind: "verb", escape: e, content: x, location: location() };
  }

// verbatim environment
Verbatim
  = escape "begin{verbatim}"
      x:$((!(escape "end{verbatim}") . )*)
    escape "end{verbatim}"
  {
    return { kind: "env.verbatim", content: x, location: location() };
  }


// minted environment
Minted
  = escape "begin{minted}" args:(argument_list? group)
      x:$((!(escape "end{minted}") . )*)
    escape "end{minted}"
  {
    return { kind: "env.minted", args: args, content: x, location: location() };
  }

// comment environment provided by \usepackage{verbatim}
commentenv
  = escape "begin{comment}"
      x:$((!(escape "end{comment}") . )*)
    escape "end{comment}"
  {
    return { kind: "env.comment", content: x, location: location() };
  }

// inline math $...$
InlineMathShift
  = math_shift
     skip_space eq:(!math_shift t:MathElement {return t;})+
    math_shift
  {
    return { kind: "math.inline", content: eq, location: location() };
  }
  / math_shift
     whitespace eq:(!math_shift t:MathElement {return t;})*
    math_shift
  {
    return { kind: "math.inline", content: eq, location: location() };
  }

//inline math with \(\)
InlineMathParen
  = beginInlineMath
      skip_space x:(!endInlineMath x:MathElement {return x;})*
    endInlineMath
  {
    return { kind: "math.inline", content: x, location: location() };
  }

//display math with \[\]
//display math with $$ $$
DisplayMath
  = displayMathSquareBracket
  / displayMathShiftShift

displayMathSquareBracket
  = beginDisplayMath
      skip_space x:(!endDisplayMath x:MathElement {return x;})*
    endDisplayMath
  {
    return { kind: "math.display", content: x, location: location() };
  }

displayMathShiftShift
  = math_shift math_shift
      skip_space x:(!(math_shift math_shift) x:MathElement {return x;})*
    math_shift math_shift
  {
    return { kind: "math.display", content: x, location: location() };
  }

command
  = escape n:command_name args:(argument_list / group)*
  {
    return { kind: "command", name: n, args: args, location: location() };
  }

command_name
  = n:$(char+) skip_space '*' { return n + '*'; }
  / $(char+)
  / "\\*"
  / .

group
  = skip_space beginGroup skip_space x:(!endGroup c:element {return c;})* endGroup
  {
    return { kind: "arg.group", content: x, location: location() };
  }

// group that assumes you're in math mode.
math_group
  = skip_space beginGroup skip_space x:(!endGroup c:MathElement {return c;})* endGroup
  {
    return { kind: "arg.group", content: x, location: location() };
  }

// \left( ... \right) in math mode.
math_matching_paren
  = skip_space
    escape "left" l:$math_delimiter
      skip_space x:(!(escape "right" math_delimiter) c:MathElement {return c;})*
    escape "right" r:$math_delimiter
  {
    return { kind: "math.matching_paren", left: l, right: r, content: x, location: location() };
  }

math_delimiter
  = [()\[\]|/]
  / escape [.{}|]
  / escape char+

argument_list
  = skip_space "[" body:(!"]" x:(args_delimiter / args_token) {return x;})* "]"
  {
    return { kind: "arg.optional", content: body, location: location() };
  }

args_token
  = SpecialCommand
  / command
  / group
  / InlineMathShift
  / AlignmentTab
  / sp* nl sp* nl+ sp* { return {kind:"parbreak", location: location()}; }
  / CommandParameterWithNumber
  / Superscript
  / Subscript
  / ignore
  / c:$((!(noncharToken / "," / "]") . )+) { return { kind: "text.string", content: c, location: location() }; }


args_delimiter
  = ","
  {
    return { kind: "text.string", content: ",", location: location() };
  }

environment
  = beginEnv name:group_envname args:(argument_list / group)*
      skip_space body:(!(endEnv n:group_envname & {return name === n;}) x:element {return x;})*
    endEnv group_envname
  {
    return { kind: "env", name, args, content: body, location: location() };
  }

math_environment
  = beginEnv skip_space beginGroup name:math_env_name endGroup
      skip_space body: (!(endEnv n:group_envname & {return name === n;}) x:MathElement {return x;})*
    endEnv skip_space beginGroup math_env_name endGroup
  {
    return { kind: "env.math.align", name, args: [], content: body, location: location() };
  }

MathAlignedEnvironment
  = beginEnv skip_space beginGroup name:maht_aligned_env_name endGroup
      skip_space body: (!(endEnv n:group_envname & {return name === n;}) x:MathElement {return x;})*
    endEnv skip_space beginGroup maht_aligned_env_name endGroup
  {
    return { kind: "env.math.aligned", name, args: [], content: body, location: location() };
  }

// return only envname without { and }
group_envname
  = skip_space beginGroup x:$(char+ "*"?) endGroup
  {
    return x;
  }

AmsmathTextCommand
  = escape "text" arg:group
  {
    return { kind: "command.text", arg: arg, location: location() };
  }

// comment that detects whether it is at the end of a line or on a new line
full_comment
  = nl x:comment { return { kind: "comment", content: x, location: location() }; }
  / x:comment { return { kind: "comment", content: x, location: location() }; }


beginDisplayMath
  = escape "["

endDisplayMath
  = escape "]"

beginInlineMath
  = escape "("

endInlineMath
  = escape ")"
  
beginEnv
  = escape "begin"

endEnv
  = escape "end"

math_env_name
  = "equation*"
  / "equation"
  / "align*"
  / "align"
  / "alignat*"
  / "alignat"
  / "gather*"
  / "gather"
  / "multline*"
  / "multline"
  / "flalign*"
  / "flalign"
  / "math"
  / "displaymath"

maht_aligned_env_name
  = "aligned"
  / "alignedat"
  / "cases"
  / "cases*"
  / "gathered"
  / "split"

escape = "\\"                             // catcode 0
beginGroup     = "{"                              // catcode 1
endGroup       = "}"                              // catcode 2
math_shift      = "$"                              // catcode 3

AlignmentTab                                      // catcode 4
  = "&"
  {
    return { kind: "alignmentTab" };
  }

commandParameter = "#"                            // catcode 6
Superscript     = "^"                              // catcode 7
Subscript       = "_"                              // catcode 8

ignore                                             // catcode 9
  = "\0"
  {
    return { kind: "ignore" };
  }

char            = [a-zA-Z]                         // catcode 11
num             = [0-9]                            // catcode 12 (other)
punctuation  = [.,;:\-\*/()!?=+<>\[\]]             // catcode 12
//	!"'()*+,-./:;<=>?@[]`

CommandParameterWithNumber
  = commandParameter n:$(num*)
  {
    return { kind: "commandParameter", nargs: n };
  }


// space handling

endDoc = endEnv skip_space beginGroup "document" endGroup

// nl    "newline" = !'\r''\n' / '\r' / '\r\n'        // catcode 5 (linux, os x, windows)
// sp          "whitespace"   =   [ \t]+ { return " "; }// catcode 10

// catcode 14, including the newline
comment 
  = "%"  c:$((!nl . )*) (nl / EOF)
  {
    return c;
  }

whitespace
  = (nl sp*/ sp+ nl sp* !nl/ sp+)

// catcode 5 (linux, os x, windows, unicode)
nl
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

// catcode 10
sp = [ \t]

skip_space "spaces"
  = (!break (nl / sp / skip_comment))*

skip_comment
  = c:comment
  { 
    if (options.enableComment) {
      const loc = location();
      const locJson = JSON.stringify(loc);
      if (!commentMap.has(locJson)) {
        commentMap.set(locJson, { kind: "comment", content: c, location: loc } );
      }
    }
  }

skip_all_space
  = (nl / sp / comment)*
  {
    return undefined;
  }

// ctrl_space  "control space" = escape (&nl &break / nl / sp)     { return g.brsp; }          // latex.ltx, line 540

break
  = (skip_all_space escape "par" skip_all_space)+
  {
    return true;
  }
  / sp* (nl comment* / comment+) ((sp* nl)+ / &endDoc / EOF) (sp / nl / comment)*
  {
    return true;
  }

EOF = !.
