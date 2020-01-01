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
  const timeKeeper = options.timeout;
  const commentMap = options.enableComment ? new Map() : undefined;
}

Root
  = skip_space x:(Element)*
  { 
    const comment = commentMap ? Array.from(commentMap.values()) : undefined;
    return { kind: "ast.root", content: x, comment };
  }

Preamble
  = skip_space
  x:(!(escape "begin{document}") e:Element { return e; })*
  rest:$(( escape "begin{document}" .* )?)
  {
    const comment = commentMap ? Array.from(commentMap.values()) : undefined;
    return { kind: "ast.preamble", content: x, rest, comment };
  }

Element
  = x:Element_p skip_space
  { 
    return x;
  }

Element_p
  = SpecialCommand
  / break { return { kind: "parbreak", location: location() }; }
  / DefCommand
  / Command
  / Group
  / InlineMathShift
  / AlignmentTab
  / CommandParameterWithNumber
  / Superscript
  / Subscript
  / ActiveCharacter
  / ignore
  / c:$((!noncharToken . )+)
  {
    timeKeeper && timeKeeper.check();
    return { kind: "text.string", content: c, location: location() };
  }

MathElement =
  x:MathElement_p skip_space
  { 
    return x;
  }

MathElement_p
  = MathAlignedEnvironment
  / AmsmathTextCommand
  / SpecialCommand
  / MatchingDelimiters
  / Command
  / MathGroup
  / AlignmentTab
  / CommandParameterWithNumber
  / Superscript skip_space x:MathElement { return { kind: "superscript", content: x, location: location() }; }
  / Subscript skip_space x:MathElement { return { kind: "subscript", content: x, location: location() }; }
  / ActiveCharacter
  / ignore
  / c:. { return { kind: "math.character", content: c }; }

noncharToken
  = escape
  / "%"
  / beginGroup
  / endGroup
  / mathShift
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
  / Lstlisting
  / commentenv
  / DisplayMath
  / InlineMathParen
  / MathEnvironment
  / Environment

// \verb|xxx|
Verb
  = escape name:("verb*" / "verb") e:.
      x:$((!(end:. & {return end === e;}) . )*)
    (end:. & {return end === e;})
  {
    return { kind: "verb", name, escape: e, content: x, location: location() };
  }

// verbatim environment
Verbatim
  = beginEnv skip_space beginGroup name:verbatimEnvName endGroup
      x:$((!(endEnv n:groupedEnvname & {return name === n;}) . )*)
    endEnv skip_space beginGroup verbatimEnvName endGroup
  {
    return { kind: "env.verbatim", name, content: x, location: location() };
  }

verbatimEnvName
  = $(("verbatim" / "Verbatim" / "fboxverbatim" / "boxedverbatim") "*"?)

// minted environment
Minted
  = escape "begin{minted}" args:((argumentList Group) / Group)
      x:$((!(escape "end{minted}") . )*)
    escape "end{minted}"
  {
    return { kind: "env.minted", name: "minted", args: args, content: x, location: location() };
  }

// lstlisting environment
Lstlisting
  = escape "begin{lstlisting}" arg:argumentList?
      x:$((!(escape "end{lstlisting}") . )*)
    escape "end{lstlisting}"
  {
    return { kind: "env.lstlisting", name: "lstlisting", arg: arg, content: x, location: location() };
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
  = mathShift
     skip_space eq:(!mathShift t:MathElement {return t;})+
    mathShift
  {
    return { kind: "inlineMath", content: eq, location: location() };
  }
  / mathShift
     whitespace eq:(!mathShift t:MathElement {return t;})*
    mathShift
  {
    return { kind: "inlineMath", content: eq, location: location() };
  }

//inline math with \(\)
InlineMathParen
  = beginInlineMath
      skip_space x:(!endInlineMath x:MathElement {return x;})*
    endInlineMath
  {
    return { kind: "inlineMath", content: x, location: location() };
  }

//display math, \[\] and $$ $$.
DisplayMath
  = displayMathSquareBracket
  / displayMathShiftShift

displayMathSquareBracket
  = beginDisplayMath
      skip_space x:(!endDisplayMath x:MathElement {return x;})*
    endDisplayMath
  {
    return { kind: "displayMath", content: x, location: location() };
  }

displayMathShiftShift
  = mathShift mathShift
      skip_space x:(!(mathShift mathShift) x:MathElement {return x;})*
    mathShift mathShift
  {
    return { kind: "displayMath", content: x, location: location() };
  }

Command
  = LabelCommand
  / escape n:commandName args:(argumentList / Group)*
  {
    return { kind: "command", name: n, args: args, location: location() };
  }

commandName
  = n:$((char / '@')+) skip_space '*' { return n + '*'; }
  / $((char / '@')+)
  / "\\*"
  / .

LabelCommand
  = escape "label" x:LabelGroup
  {
    return { kind: "command", name: "label", args: [x], location: location() };
  }

MathCommand
  = LabelCommand
  / escape n:commandName args:(argumentList / MathGroup)*
  {
    return { kind: "command", name: n, args: args, location: location() };
  }

DefCommand
  = escape "def" skip_space token:$(escape (char / '@')+) numArgs:(argumentList / CommandParameterWithNumber)* skip_space grArg:Group
  {
    return { kind: "command.def", token, args: numArgs.concat([grArg]), location: location() };
  }

Group
  = skip_space beginGroup skip_space x:(!endGroup c:Element {return c;})* endGroup
  {
    return { kind: "arg.group", content: x, location: location() };
  }

// group that assumes you're in math mode.
MathGroup
  = skip_space beginGroup skip_space x:(!endGroup c:MathElement {return c;})* endGroup
  {
    return { kind: "arg.group", content: x, location: location() };
  }

LabelGroup
  = skip_space beginGroup skip_space x:LabelText endGroup
  {
    return { kind: "arg.group", content: [x], location: location() };
  }

LabelText
  = c:$((!endGroup .)*)
  {
    return { kind: "text.string", content: c, location: location() };
  }

// \left( ... \right) in math mode.
MatchingDelimiters
  = skip_space
    escape "left" l:$mathDelimiter
      skip_space x:(!(escape "right" mathDelimiter) c:MathElement {return c;})*
    escape "right" r:$mathDelimiter
  {
    return { kind: "math.matching_paren", left: l, right: r, content: x, location: location() };
  }

mathDelimiter
  = [()\[\]|/]
  / escape [.{}|]
  / escape char+

argumentList
  = skip_space "[" body:(!"]" skip_space x:(argsDelimiter / argsToken) skip_space {return x;})* "]"
  {
    return { kind: "arg.optional", content: body, location: location() };
  }

argsToken
  = SpecialCommand
  / Command
  / Group
  / InlineMathShift
  / AlignmentTab
  / sp* nl sp* nl+ sp* { return {kind:"parbreak", location: location()}; }
  / CommandParameterWithNumber
  / Superscript
  / Subscript
  / ignore
  / c:$((!(noncharToken / "," / "]") . )+) { return { kind: "text.string", content: c, location: location() }; }


argsDelimiter
  = ","
  {
    return { kind: "text.string", content: ",", location: location() };
  }

Environment
  = beginEnv name:groupedEnvname args:(argumentList / Group)*
      skip_space body:(!(endEnv n:groupedEnvname & {return name === n;}) x:Element {return x;})*
    endEnv groupedEnvname
  {
    return { kind: "env", name, args, content: body, location: location() };
  }

MathEnvironment
  = beginEnv skip_space beginGroup name:mathEnvName endGroup
      skip_space body:(!(endEnv n:groupedEnvname & {return name === n;}) x:MathElement {return x;})*
    endEnv skip_space beginGroup mathEnvName endGroup
  {
    return { kind: "env.math.align", name, args: [], content: body, location: location() };
  }

MathAlignedEnvironment
  = beginEnv skip_space beginGroup name:mahtAlignedEnvName endGroup
      skip_space body: (!(endEnv n:groupedEnvname & {return name === n;}) x:MathElement {return x;})*
    endEnv skip_space beginGroup mahtAlignedEnvName endGroup
  {
    return { kind: "env.math.aligned", name, args: [], content: body, location: location() };
  }

// return only envname without { and }
groupedEnvname
  = skip_space beginGroup x:$(char+ "*"?) endGroup
  {
    return x;
  }

AmsmathTextCommand
  = escape "text" arg:Group
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

mathEnvName
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

mahtAlignedEnvName
  = "aligned"
  / "alignedat"
  / "cases"
  / "cases*"
  / "gathered"
  / "split"

escape         = "\\"                             // catcode 0
beginGroup     = "{"                              // catcode 1
endGroup       = "}"                              // catcode 2
mathShift      = "$"                              // catcode 3

AlignmentTab                                      // catcode 4
  = "&"
  {
    return { kind: "alignmentTab", location: location() };
  }

commandParameter = "#"                            // catcode 6

Superscript                            // catcode 7
  = "^"
  {
    return { kind: "superscript", content: [], location: location() };
  }

Subscript                             // catcode 8
  = "_"
  {
    return { kind: "subscript", content: [], location: location() };
  }

ignore                                            // catcode 9
  = "\0"
  {
    return { kind: "ignore", location: location() };
  }

char            = [a-zA-Z]                         // catcode 11
num             = [0-9]                            // catcode 12 (other)
punctuation  = [.,;:\-\*/()!?=+<>\[\]]             // catcode 12
//	!"'()*+,-./:;<=>?@[]`

ActiveCharacter                                    // catcode 13
  = "~"
  {
    return { kind: "activeCharacter", location: location() };
  }

CommandParameterWithNumber
  = commandParameter n:$(num*)
  {
    return { kind: "commandParameter", nargs: n, location: location() };
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
  = (nl / sp / skip_comment)*
  {
    return undefined;
  }

// ctrl_space  "control space" = escape (&nl &break / nl / sp)     { return g.brsp; }          // latex.ltx, line 540

break
  = (skip_all_space escape "par" !char skip_all_space)+
  {
    return true;
  }
  / sp* (nl skip_comment* / skip_comment+) ((sp* nl)+ / &endDoc / EOF) (sp / nl / skip_comment)*
  {
    return true;
  }

EOF = !.
