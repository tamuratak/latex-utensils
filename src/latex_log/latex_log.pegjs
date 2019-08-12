ExtractFileStack
  = (!FileStack .)* x:EachFileStack+ .*
  {
      return x;
  }

EachFileStack
  = (!FileStack .)* x:FileStack
  {
      return x;
  }

FileStack
  = '(' path:Path ')' Delimiter+
  {
      return { kind: 'node', path, content: [] };
  }
  / '(' path:Path Delimiter+ content:FileStackElement+ ')' __
  {
      return { kind: 'node', path, content };
  }

FileStackElement
  = FileStack 
  / PageNumber
  / x:$(LogTextElement+)
  {
      return { kind: 'text_string', content:x };
  }

PageNumber
  = '[' page:$([0-9]+) __ content:$([^\]]*) ']'
  {
      return { kind: 'page_number', page: Number(page), content }
  }

PageNumberChar
  = !']' .
  / ']' & ' ['

LogTextElement
  = !FileStack ParenthesisString
  / !FileStack !PageNumber [^()]

ParenthesisString
  = '(' LogTextElement+ ')'

Path
  = $( ('.' / '/') PathChar+ )

PathChar
  = !')' Char
  / ')' !Delimiter !')'

Char = !Delimiter .
  
Delimiter = ' ' / '\r\n' / '\n'

__ = ('\r\n' / [ \t\n])*
