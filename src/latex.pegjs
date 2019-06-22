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
  function compare_env(g1,g2) {
      return g1.content.join("") == g2.content.join("");
  }
}

root
  = skip_space x:(element)*
  { 
    const comment = commentMap ? Array.from(commentMap.values()) : undefined;
    return { kind: "ast.root", content: x, comment };
  }

preamble
  = skip_space
  x:(!(escape "begin{document}") e:element_p skip_space { return e; })*
  rest:$(( escape "begin{document}" .* )?)
  {
    const comment = commentMap ? Array.from(commentMap.values()) : undefined;
    return { kind: "ast.preamble", content: x, rest: rest, comment };
  }

element "element"
  = x:element_p skip_space
  { 
    return x;
  }

element_p
  = result:
  ( special_command
  / break { return { kind: "parbreak", location: location() }; }
  / command
  / group
  / inlinemath_shift
  / alignment_tab
  / command_parameter_with_number
  / superscript
  / subscript
  / ignore
  / number
  / $((!nonchar_token . )+)
  )
  {
    if (typeof result === "string") {
      return { kind: "text.string", content: result, location: location() };
    } else {
      return result;
    }
  }

math_element =
  x:math_element_p skip_space
  { 
    return x;
  }

math_element_p
  = result:
  ( math_aligned_environment
  / amsmath_text_command
  / special_command
  / command
  / group
  / alignment_tab
  / command_parameter_with_number
  / superscript skip_space x:math_element { return { kind: "superscript", content: x, location: location() }; }
  / subscript skip_space x:math_element { return { kind: "subscript", content: x, location: location() }; }
  / ignore
  / .
  )
  {
    if (typeof result === "string") {
      return { kind: "text.string", content: result, location: location() };
    } else {
      return result;
    }
  }

args_token "args token"
  = result:
  ( special_command
  / command
  / group
  / inlinemath_shift
  / alignment_tab
  / sp* nl sp* nl+ sp* {return {kind:"parbreak", location: location()}}
  / command_parameter_with_number
  / superscript
  / subscript
  / ignore
  / number
  / $((!(nonchar_token / "," / "]") . )+)
  )
  {
    if (typeof result === "string") {
      return { kind: "text.string", content: result, location: location() };
    } else {
      return result;
    }
  }

args_delimiter
  = ","
  {
    return { kind: "text.string", content: ",", location: location() };
  }

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
  = $(num+ "." num+)
  / $("." num+)
  / $(num+ ".")
  / $(num+)

// for the special commands like \[ \] and \begin{} \end{} etc.
special_command "special command"
  = verb
  / verbatim
  / minted
  / commentenv
  / displaymath
  / inlinemath_paren
  / math_environment
  / environment

// \verb|xxx|
verb
  = escape "verb" e:.
      x:$((!(end:. & {return end === e}) . )*)
    (end:. & {return end === e})
  {
    return { kind: "verb", escape: e, content: x, location: location() };
  }

// verbatim environment
verbatim
  = escape "begin{verbatim}"
      x:$((!(escape "end{verbatim}") . )*)
    escape "end{verbatim}"
  {
    return { kind: "env.verbatim", content: x, location: location() };
  }


// minted environment
minted
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
inlinemath_shift
  = math_shift
     skip_space eq:(!math_shift t:math_element {return t})+
    math_shift
  {
    return { kind: "math.inline", content: eq, location: location() };
  }
  / math_shift
     whitespace eq:(!math_shift t:math_element {return t})*
    math_shift
  {
    return { kind: "math.inline", content: eq, location: location() };
  }

//inline math with \(\)
inlinemath_paren
  = begin_inline_math
      skip_space x:(!end_inline_math x:math_element {return x})*
    end_inline_math
  {
    return { kind: "math.inline", content: x, location: location() };
  }

//display math with \[\]
//display math with $$ $$
displaymath
  = displaymath_square_bracket
  / displaymath_shift_shift

displaymath_square_bracket
  = begin_display_math
      skip_space x:(!end_display_math x:math_element {return x})*
    end_display_math
  {
    return { kind: "math.display", content: x, location: location() };
  }

displaymath_shift_shift
  = math_shift math_shift
      skip_space x:(!(math_shift math_shift) x:math_element {return x})*
    math_shift math_shift
  {
    return { kind: "math.display", content: x, location: location() };
  }

command "command"
  = escape n:command_name args:(argument_list / group)*
  {
    return { kind: "command", name: n, args: args, location: location() };
  }

command_name
  = n:$(char+) skip_space '*' { return n + '*'; }
  / $(char+)
  / "\\*"
  / .

group "group"
  = skip_space begin_group skip_space x:(!end_group c:element {return c})* end_group
  {
    return { kind: "arg.group", content: x, location: location() };
  }


group_envname "envname group"
  = skip_space begin_group x:(!end_group c:element {return c})* end_group
  {
    if (x.length === 1 && x[0].kind === "text.string") {
      return { kind: "arg.group", content: [x[0].content] };
    } else {
      return { kind: "arg.group", content: x };
    }
  }


argument_list "optional argument"
  = skip_space "[" body:(!"]" x:(args_delimiter / args_token) {return x})* "]"
  {
    return { kind: "arg.optional", content: body, location: location() };
  }


environment "environment"
  = begin_env skip_space env:group_envname args:(argument_list / group)*
      skip_space body:(!(end_env end_env:group_envname & {return compare_env(env,end_env)}) x:element {return x})*
    end_env skip_space group_envname
  {
    return { kind: "env", name: env.content[0], args: args, content: body, location: location() };
  }

math_environment "math environment"
  = begin_env skip_space begin_group env:math_env_name end_group
      skip_space body: (!(end_env end_env:group_envname & {return compare_env({content:[env]},end_env)}) x:math_element {return x})*
    end_env skip_space begin_group math_env_name end_group
  {
    return { kind: "env.math.align", name: env, args: [], content: body, location: location() };
  }

math_aligned_environment "math aligned environment"
  = begin_env skip_space begin_group env:maht_aligned_env_name end_group
      skip_space body: (!(end_env end_env:group_envname & {return compare_env({content:[env]},end_env)}) x:math_element {return x})*
    end_env skip_space begin_group maht_aligned_env_name end_group
  {
    return { kind: "env.math.aligned", name: env, args: [], content: body, location: location() };
  }

// group that assumes you're in math mode.
math_group "math group"
  = begin_group x:(!end_group c:math_element {return c})* end_group
  {
    return { kind: "arg.group", content: x, location: location() };
  }

amsmath_text_command
  = escape "text" arg:group
  {
    return { kind: "command.text", arg: arg, location: location() };
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

alignment_tab                                      // catcode 4
  = "&"
  {
    return { kind: "alignment_tab" };
  }

command_parameter = "#"                            // catcode 6
superscript     = "^"                              // catcode 7
subscript       = "_"                              // catcode 8

ignore                                             // catcode 9
  = "\0"
  {
    return { kind: "ignore" };
  }

char            = [a-zA-Z]                         // catcode 11
num             = [0-9]                            // catcode 12 (other)
punctuation  = [.,;:\-\*/()!?=+<>\[\]]             // catcode 12
//	!"'()*+,-./:;<=>?@[]`

command_parameter_with_number
  = command_parameter n:$(num*)
  {
    return { kind: "command_parameter", nargs: n };
  }


// space handling

end_doc = end_env skip_space begin_group "document" end_group

// nl    "newline" = !'\r''\n' / '\r' / '\r\n'        // catcode 5 (linux, os x, windows)
// sp          "whitespace"   =   [ \t]+ { return " "}// catcode 10

// catcode 14, including the newline
comment 
  = "%"  c:$((!nl . )*) (nl / EOF)
  {
    return c;
  }

whitespace
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
    if (options.enableComment) {
      const loc = location();
      const locJson = JSON.stringify(loc);
      if (!commentMap.has(locJson)) {
        commentMap.set(locJson, { kind: "comment", content: c, location: loc } );
      }
    }
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
