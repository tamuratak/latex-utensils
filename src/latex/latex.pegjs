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
  x:(!(skip_space escape "begin{document}") e:Element { return e; })*
  skip_space rest:$((escape "begin{document}" .* )?)
  {
    const comment = commentMap ? Array.from(commentMap.values()) : undefined;
    return { kind: "ast.preamble", content: x, rest, comment };
  }

Element
  = x:Element_p skip_comment*
  { 
    return x;
  }

Element_p
  = SpecialCommand
  / break
  / Linebreak
  / DefCommand
  / Command
  / Group_p
  / InlineMathShift
  / AlignmentTab
  / CommandParameterWithNumber
  / Superscript
  / Subscript
  / ActiveCharacter
  / ignore
  / Softbreak
  / c:$((!noncharToken . )+)
  {
    timeKeeper && timeKeeper.check();
    return { kind: "text.string", content: c, location: location() };
  }
  / Space

MathElement =
  x:MathElement_p skip_space
  { 
    return x;
  }

MathElement_p
  = MathAlignedEnvironment
  / Linebreak
  / AmsmathTextCommand
  / SpecialCommand
  / MatchingDelimiters
  / MathematicalDelimiters
  / MathCommand
  / MathGroup
  / AlignmentTab
  / CommandParameterWithNumber
  / SuperscriptWithArg
  / SubscriptWithArg
  / ActiveCharacter
  / ignore
  / c:$(!nonMathcharToken .) {
    if (options.enableMathCharacterLocation) {
      return { kind: "math.character", content: c, location: location() };
    } else {
      return { kind: "math.character", content: c };
    }
  }

nonMathcharToken
  = mathShift
  / escape

noncharToken
  = escape
  / "%"
  / beginGroup
  / endGroup
  / mathShift
  / AlignmentTab
  / ActiveCharacter
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
  = UrlCommand
  / HrefCommand
  / Verb
  / Verbatim
  / Minted
  / Lstlisting
  / commentenv
  / DisplayMath
  / InlineMathParen
  / MathEnvironment
  / Environment


// \label{...} \ref{...}
LabelCommand
  = escape name:("ref" / "eqref" / "autoref") skip_space beginGroup label:labelString endGroup
  {
    return { kind: "command.label", name, label: label.join(''), location: location() };
  }
  / escape name:("label") skip_space ArgumentList? beginGroup label:labelString endGroup
  {
    return { kind: "command.label", name, label: label.join(''), location: location() };
  }

labelString
  = ( skip_comment / $pairedCurlySkippingComment / $(!"}" .) )+

pairedCurlySkippingComment
  = "{" ( skip_comment / $pairedCurlySkippingComment / $(!"}" .) )* "}"

// \url{...} \href{url}{content}
UrlCommand
  = escape "url" skip_space beginGroup x:$urlString endGroup
  {
    return { kind: "command.url", name: "url", url: x, location: location() };
  }

HrefCommand
  = escape "href" arg:ArgumentList? skip_space beginGroup x:$urlString endGroup grp:Group
  {
    return { kind: "command.href", name: "href", url: x, content: grp.content, arg: arg || undefined, location: location() };
  }

urlString
  = ( pairedCurly / (!"}" .) )*

pairedCurly
  = "{" ( pairedCurly / (!"}" .) )* "}"

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
  = x:Verbatim_p skip_space
  {
    return x;
  }

Verbatim_p
  = beginEnv beginGroup "verbatim" endGroup
      x:$((!(endEnv beginGroup "verbatim" endGroup) . )*)
    endEnv beginGroup "verbatim" endGroup
  {
    return { kind: "env.verbatim", name: "verbatim", content: x, location: location() };
  }
  / beginEnv beginGroup "verbatim*" endGroup
      x:$((!(endEnv beginGroup "verbatim*" endGroup) . )*)
    endEnv beginGroup "verbatim*" endGroup
  {
    return { kind: "env.verbatim", name: "verbatim*", content: x, location: location() };
  }


// minted environment
Minted
  = x:Minted_p skip_space
  {
    return x;
  }

Minted_p
  = beginEnv beginGroup "minted" endGroup args:((ArgumentList Group) / Group)
      x:$((!(endEnv beginGroup "minted" endGroup) . )*)
    endEnv beginGroup "minted" endGroup
  {
    return { kind: "env.minted", name: "minted", args: args, content: x, location: location() };
  }

// lstlisting environment
Lstlisting
  = x:Lstlisting_p skip_space
  {
    return x;
  }

Lstlisting_p
  = beginEnv beginGroup "lstlisting" endGroup arg:ArgumentList?
      x:$((!(endEnv beginGroup "lstlisting" endGroup) . )*)
    endEnv beginGroup "lstlisting" endGroup
  {
    return { kind: "env.lstlisting", name: "lstlisting", arg: arg, content: x, location: location() };
  }

// comment environment provided by \usepackage{verbatim}
commentenv
  = beginEnv beginGroup "comment" endGroup
      x:$((!(endEnv beginGroup "comment" endGroup) . )*)
    endEnv beginGroup "comment" endGroup skip_space
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

// \abc, \abc[...]{...}{...}
Command
  = PrimitiveCharacterCommand
  / LabelCommand
  / escape n:commandName args:(ArgumentList / Group)+
  {
    return { kind: "command", name: n, args: args, location: location() };
  }
  / x:Command_p skip_space
  {
    return x;
  }

Command_p
  = escape n:commandName
  {
    return { kind: "command", name: n, args: [], location: location() };
  }

commandName
  = n:$((char / '@')+) skip_space '*' { return n + '*'; }
  / $((char / '@')+)
  / "\\*"
  / .

PrimitiveCharacterCommand
  = escape c:[ $%#&{}_\-,/@]
  {
    return { kind: "command", name: c, args: [], location: location() };
  }

MathCommand
  = LabelCommand
  / escape n:$(!nonMathCommandName commandName) args:(ArgumentList / MathGroup)*
  {
    return { kind: "command", name: n, args: args, location: location() };
  }

nonMathCommandName
  = "end" [^a-zA-Z]
  / "["
  / "]"
  / "("
  / ")"

DefCommand
  = escape "def" skip_space token:$(escape (char / '@')+) numArgs:(ArgumentList / CommandParameterWithNumber)* grArg:Group
  {
    return { kind: "command.def", token, args: numArgs.concat([grArg]), location: location() };
  }

Group
  = skip_space x:Group_p
  {
    return x;
  }

Group_p
  = beginGroup skip_comment* x:(!endGroup c:Element {return c;})* endGroup
  {
    return { kind: "arg.group", content: x, location: location() };
  }

// group that assumes you're in math mode.
MathGroup
  = skip_space x:MathGroup_p
  {
    return x;
  }

MathGroup_p
  = beginGroup skip_space x:(!endGroup c:MathElement {return c;})* endGroup
  {
    return { kind: "arg.group", content: x, location: location() };
  }

// \left( ... \right) in math mode.
MatchingDelimiters
  = skip_space x:MatchingDelimiters_p
  {
    return x;
  }

MatchingDelimiters_p
  = escape "left" skip_space l:$mathDelimiter
      skip_space x:(!(escape "right" mathDelimiter) c:MathElement {return c;})*
    escape "right" skip_space r:$mathDelimiter
  {
    return { kind: "math.matching_delimiters", left: l, right: r, content: x, location: location() };
  }

mathDelimiter
  = [()\[\]|/.]
  / escape [{}]
  / escape char+


// (..) [..] \{..\}
MathematicalDelimiters
  = skip_space x:MathematicalDelimiters_p
  {
    return x;
  }

MathematicalDelimiters_p
  = l:$sizeCommand? skip_space "(" skip_space
      x:(!(r:sizeCommand? ")") c:MathElement {return c;} )*
    r:$sizeCommand? skip_space ")"
  {
    return { kind: "math.math_delimiters", lcommand: l, rcommand: r, left: "(", right: ")", content: x, location: location() };
  }
  / l:$sizeCommand? skip_space "[" skip_space
      x:(!(r:sizeCommand? "]") c:MathElement {return c;} )*
    r:$sizeCommand? skip_space "]"
  {
    return { kind: "math.math_delimiters", lcommand: l, rcommand: r, left: "[", right: "]", content: x, location: location() };
  }
  / l:$sizeCommand? skip_space "\\{" skip_space
      x:(!(r:sizeCommand? "\\}") c:MathElement {return c;} )*
    r:$sizeCommand? skip_space "\\}"
  {
    return { kind: "math.math_delimiters", lcommand: l, rcommand: r, left: "\\{", right: "\\}", content: x, location: location() };
  }

sizeCommand
  = escape ("bigg" / "Bigg" / "big" / "Big") [rlm]?

// [...]
ArgumentList
  = skip_space x:ArgumentList_p
  {
    return x;
  }

ArgumentList_p
  = "[" skip_space body:(!"]" x:(argsDelimiter / argsToken) skip_space {return x;})* "]"
  {
    return { kind: "arg.optional", content: body, location: location() };
  }

argsToken
  = SpecialCommand
  / Command
  / Group
  / InlineMathShift
  / AlignmentTab
  / sp* nl sp* nl+ sp* { return { kind:"parbreak", location: location() }; }
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
  = skip_space x:Environment_p skip_space
  {
    return x;
  }

Environment_p
  = beginEnv name:groupedEnvname args:(ArgumentList / Group)*
      skip_space body:(!(skip_space endEnv) x:Element {return x;})* skip_space
    endEnv n:groupedEnvname &{ return name === n; }
  {
    return { kind: "env", name, args, content: body, location: location() };
  }

MathEnvironment
  = skip_space x:MathEnvironment_p skip_space
  {
    return x;
  }

MathEnvironment_p
  = beginEnv skip_space beginGroup name:mathEnvName endGroup
      skip_space body:(!(skip_space endEnv) x:MathElement {return x;})* skip_space
    endEnv skip_space beginGroup n:mathEnvName endGroup &{ return name === n; }
  {
    return { kind: "env.math.align", name, args: [], content: body, location: location() };
  }

MathAlignedEnvironment
  = beginEnv skip_space beginGroup name:mahtAlignedEnvName endGroup
      skip_space body:(!endEnv x:MathElement {return x;})*
    endEnv skip_space beginGroup n:mahtAlignedEnvName endGroup &{ return name === n; }
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
  = "alignedat"
  / "aligned"
  / "cases*"
  / "cases"
  / "gathered"
  / "split"
  / "matrix"
  / "bmatrix"
  / "pmatrix"
  / "vmatrix"
  / "Bmatrix"
  / "Vmatrix"

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

SuperscriptWithArg
  = Superscript skip_space x:MathElement
  {
    return { kind: "superscript", arg: x, location: location() };
  }

Superscript                            // catcode 7
  = "^"
  {
    return { kind: "superscript", arg: undefined, location: location() };
  }

SubscriptWithArg
  = Subscript skip_space x:MathElement
  {
    return { kind: "subscript", arg: x, location: location() };
  }

Subscript                             // catcode 8
  = "_"
  {
    return { kind: "subscript", arg: undefined, location: location() };
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
  = "%" c:$((!nl . )*) (nl / EOF)
  {
    return c;
  }

// \linebreak, \linebreak[...], \\, \\[...], \\*, \\*[...], \newline
Linebreak
  = skip_space x:Linebreak_p skip_space
  {
    return x;
  }

Linebreak_p
  = escape n:"linebreak" arg:ArgumentList?
  {
    return { kind: "linebreak", name: n, arg: arg || undefined, location: location() };
  }
  / escape n:(escape "*" / escape) arg:ArgumentList?
  {
    return { kind: "linebreak", name: n, arg: arg || undefined, location: location() };
  }
  / escape n:("newline*" / "newline")
  {
    return { kind: "linebreak", name: n, arg: undefined, location: location() }
  }

Softbreak
  = (!break (sp / skip_comment))* !break nl (!break (sp / skip_comment))*
  {
    return { kind: "softbreak" };
  }

Space
  = (!break (nl / sp))+
  {
    return { kind: "space" };
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
    return { kind: "parbreak", location: location() };
  }
  / sp* (nl skip_comment* / skip_comment+) (sp* nl)+ (sp / nl / skip_comment)*
  {
    return { kind: "parbreak", location: location() };
  }

EOF = !.
