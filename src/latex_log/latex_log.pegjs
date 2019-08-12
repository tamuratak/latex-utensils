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
  / LogText

TexError
  = '!' skip_space message:$(TexErrorChar+) LineBreak
    'l.' line:$([0-9]+) skip_space command:$(( !LineBreak . )*) __
  {
      return { kind: 'tex_error', message, line: Number(line), command: command || undefined };
  }

TexErrorChar
  = ( !( LineBreak 'l.' [0-9]+ ) . )

PageNumber
  = '[' page:$([0-9]+) __ content:$([^\]]*) ']'
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
  / !FileStack !TexError !PageNumber [^()]

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

__ = ('\r\n' / [ \t\n])*
