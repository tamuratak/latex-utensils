/*

MIT License

Copyright (c) 2015-2017 Michael Brade, Jason Siefken

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
  const commentArray = [];
  function compare_env(g1,g2) {
      return g1.content.join("") == g2.content.join("");
  }
}

document "document"
  = x:(element)*
  { 
    return { content: x, comment: commentArray };
  }

element "element"
  = skip_space x:element_ skip_space
  { 
    return x;
  }

element_
  = special_command
  / break { return { kind: "parbreak" }; }
  / command
  / full_comment
  / group
  / inlinemath_shift
  / alignment_tab
  / command_parameter
  / superscript
  / subscript
  / ignore
  / number
  / x:(!nonchar_token x:. {return x})+ { return x.join(""); }

math_element =
  skip_space x:math_element_ skip_space
  { 
    return x;
  }

math_element_
  = math_aligned_environment
  / special_command
  / command
  / full_comment
  / group
  / alignment_tab
  / command_parameter
  / superscript x:math_element { return { kind: "superscript", content: x }; }
  / subscript x:math_element { return { kind: "subscript", content: x }; }
  / ignore
  / .

args_token "args token"
  = special_command
  / command
  / full_comment
  / group
  / inlinemath_shift
  / alignment_tab
  / sp* nl sp* nl+ sp* {return {kind:"parbreak"}}
  / command_parameter
  / superscript
  / subscript
  / ignore
  / number
  / x:(!(nonchar_token / "," / "]") x:. {return x})+ { return x.join(""); }

nonchar_token "nonchar token"
  = escape
  / "%"
  / begin_group
  / end_group
  / math_shift
  / alignment_tab
  / nl
  / command_parameter
  / superscript
  / subscript
  / ignore
  / sp
  / EOF

number "number"
  = a:num+ "." b:num+ {return a.join("") + "." + b.join("")}
  / "." b:num+ {return "." + b.join("")}
  / a:num+ "." {return a.join("") + "."}

// for the special commands like \[ \] and \begin{} \end{} etc.
special_command "special command"
  = verb
  / verbatim
  / commentenv
  / displaymath
  / inlinemath
  / math_environment
  / environment

// \verb|xxx|
verb
  = escape "verb" e:.
      x:(!(end:. & {return end == e}) x:. {return x})*
    (end:. & {return end == e})
  {
    return { kind: "verb", escape: e, content: x.join("") };
  }

// verbatim environment
verbatim
  = escape "begin{verbatim}"
      x:(!(escape "end{verbatim}") x:. {return x})*
    escape "end{verbatim}"
  {
    return { kind: "env.verbatim", content: x.join("") };
  }

// comment environment provided by \usepackage{verbatim}
commentenv
  = escape "begin{comment}"
      x:(!(escape "end{comment}") x:. {return x})*
    escape "end{comment}"
  {
    return { kind: "env.comment", content: x.join("") };
  }


inlinemath_shift
  = math_shift
     eq:(!math_shift t:math_element {return t})+
    math_shift
  {
    return { kind: "math.inline", content: eq };
  }

//inline math with \(\)
inlinemath
  = begin_inline_math
      x:(!end_inline_math x:math_element {return x})+
    end_inline_math
  {
    return { kind: "math.inline", content: x };
  }

//display math with \[\]
//display math with $$ $$
displaymath
  = displaymath_square_bracket
  / displaymath_shift_shift

displaymath_square_bracket
  = begin_display_math
      x:(!end_display_math x:math_element {return x})+
    end_display_math
  {
    return { kind: "math.display", content: x };
  }

displaymath_shift_shift
  = math_shift math_shift
      x:(!(math_shift math_shift) x:math_element {return x})+
    math_shift math_shift
  {
    return { kind: "math.display", content: x };
  }

command "command"
  = escape n:command_name args:(argument_list / group)*
  {
    return { kind: "command", name: n, args: args };
  }

command_name
  = n:$(char+) skip_space '*' { return n + '*'; }
  / $(char+)
  / "\\*"
  / .

group "group"
  = begin_group x:(!end_group c:element {return c})* end_group
  {
    return { kind: "arg.group", content: x };
  }


argument_list "optional argument"
  = skip_space "[" body:(!"]" x:("," / args_token) {return x})* "]"
  {
    return { kind: "arg.optional", content: body };
  }


environment "environment"
  = begin_env skip_space env:group args:(argument_list / group)*
      body:(!(end_env end_env:group & {return compare_env(env,end_env)}) x:element {return x})*
    end_env skip_space group
  {
    return { kind: "env", name: env.content[0], args: args, content: body };
  }

math_environment "math environment"
  = begin_env skip_space begin_group env:math_env_name end_group
      body: (!(end_env end_env:group & {return compare_env({content:[env]},end_env)}) x:math_element {return x})*
    end_env skip_space begin_group math_env_name end_group
  {
    return { kind: "env.math.align", name: env, content: body };
  }

math_aligned_environment "math aligned environment"
  = begin_env skip_space begin_group env:maht_aligned_env_name end_group
      body: (!(end_env end_env:group & {return compare_env({content:[env]},end_env)}) x:math_element {return x})*
    end_env skip_space begin_group maht_aligned_env_name end_group
  {
    return { kind: "env.math.aligned", name: env, content: body };
  }

// group that assumes you're in math mode.  If you use "\text{}" this isn't a good idea....
math_group "math group"
  = begin_group x:(!end_group c:math_element {return c})* end_group
  {
    return { kind: "group", content: x };
  }

// comment that detects whether it is at the end of a line or on a new line
full_comment "full comment"
  = nl x:comment { return { kind: "comment", content: x, location: location() } }
  / x:comment { return { kind: "comment", content: x, location: location() } }


begin_display_math = escape "["
end_display_math = escape "]"
begin_inline_math = escape "("
end_inline_math = escape ")"
  
begin_env = escape "begin"
end_env = escape "end"

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

escape "escape" = "\\"                             // catcode 0
begin_group     = "{"                              // catcode 1
end_group       = "}"                              // catcode 2
math_shift      = "$"                              // catcode 3
alignment_tab   = "&"                              // catcode 4
command_parameter = "#"                              // catcode 6
superscript     = "^"                              // catcode 7
subscript       = "_"                              // catcode 8
ignore          = "\0"                             // catcode 9
char        "letter"       = c:[a-zA-Z]            // catcode 11
num         "digit"        = n:[0-9]               // catcode 12 (other)
punctuation "punctuation" = p:[.,;:\-\*/()!?=+<>\[\]]   // catcode 12

// space handling

end_doc = end_env skip_space begin_group "document" end_group

// nl    "newline" = !'\r''\n' / '\r' / '\r\n'        // catcode 5 (linux, os x, windows)
// sp          "whitespace"   =   [ \t]+ { return " "}// catcode 10

// catcode 14, including the newline
comment 
  = "%"  c:(!nl c:. {return c})* (nl / EOF) 
  {
    return c.join("");
  }

whitespace "whitespace"
  = (nl sp*/ sp+ nl sp* !nl/ sp+)

// catcode 5 (linux, os x, windows, unicode)
nl  "newline"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

// catcode 10
sp  "whitespace"
  = [ \t]

skip_space "spaces"
  = (!break (nl / sp / skip_comment))*

skip_comment
  = c:comment
  { 
    commentArray.push( { kind: "comment", content: c, location: location() } );
  }

skip_all_space  "spaces"
  = (nl / sp / comment)*
  {
    return undefined;
  }

// ctrl_space  "control space" = escape (&nl &break / nl / sp)     { return g.brsp; }          // latex.ltx, line 540

break "paragraph break"
  = (skip_all_space escape "par" skip_all_space)+
  {
    return true;
  }
  / sp* (nl comment* / comment+) ((sp* nl)+ / &end_doc / EOF) (sp / nl / comment)*
  {
    return true;
  }

EOF = !.
