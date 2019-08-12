Root
  = x:(LogTextOutsideFileStack / FileStack)+
  {
      return { content: x };
  }

FileStack
  = '(' path:Path ')' &(')' / Delimiter) __
  {
      return { kind: 'file_stack', path, content: [] };
  }
  / '(' path:Path Delimiter+ content:FileStackElement+ ')' __
  {
      return { kind: 'file_stack', path, content };
  }

FileStackElement
  = FileStack 
  / PageNumber
  / TexError
  / LatexmkError
  / LogText

TexError
  = LineBreak '!' skip_space body:TexErrorBody __
  {
      return { kind: 'tex_error', message: body.message, line: body.line, command: body.command };
  }

LatexmkError
  = LineBreak head:LatexmkErrorPrefix skip_space body:TexErrorBody __
  {
      return { kind: 'latexmk_error', message: body.message, path: head.path, line: head.line, command: body.command };
  }

LatexmkErrorPrefix
  = path:$(PathPrefix (!(':' [0-9]+ ': ') .)+) ':' line:$([0-9]+) ':'
  {
    return { path, line: Number(line) };
  }

TexErrorBody
  = message:$(TexErrorChar+)
    LineBreak 'l.' line:$([0-9]+) skip_space command:$(( !LineBreak . )*)
  {
      return { message, line: Number(line), command: command || undefined };
  }

TexErrorChar
  = ( !( LineBreak 'l.' [0-9]+ ) . )

PageNumber
  = '[' page:$([0-9]+) __ content:$([^\]]*) ']' __
  {
      return { kind: 'page_number', page: Number(page), content: content || undefined };
  }

PageNumberChar
  = !']' .
  / ']' & ' ['

LogTextOutsideFileStack
  = x:$((!FileStack .)+)
  {  
      return { kind: 'text_string', content:x };
  }

LogText
  = x:$(LogTextElement+)
  {
      return { kind: 'text_string', content:x };
  }

LogTextElement
  = !FileStack ParenthesisString
  / !FileStack !TexError !LatexmkError !PageNumber [^()]

ParenthesisString
  = '(' LogTextElement+ ')'

Path
  = $( PathPrefix PathChar+ )

PathPrefix = '.' / '/' / [a-zA-Z] ':' / '\\\\'

PathChar
  = !')' Char
  / ')' !Delimiter !')'

Char = !Delimiter .

LineBreak = '\r\n' / '\n'

Delimiter = ' ' / '\t' / '\r\n' / '\n'

skip_space = [ \t]*

__ = ([ \t] / !TexError !LatexmkError LineBreak )*
