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
  / LogText

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
  / !FileStack !PageNumber [^()]

ParenthesisString
  = '(' LogTextElement+ ')'

Path
  = $( PathPrefix PathChar+ )

PathPrefix = '.' / '/' / [a-zA-Z] ':' / '\\\\'

PathChar
  = !')' Char
  / ')' !Delimiter !')'

Char = !Delimiter .
  
Delimiter = ' ' / '\t' / '\r\n' / '\n'

__ = ('\r\n' / [ \t\n])*
