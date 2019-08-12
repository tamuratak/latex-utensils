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
      return { path, content: [] };
  }
  / '(' path:Path Delimiter+ content:FileStackElement+ ')' __
  {
      return { path, content };
  }

FileStackElement
  = x:FileStack 
  {
      return x;
  }
  / $(LogTextElement+)
 
LogTextElement
  = !FileStack ParenthesisString
  / !FileStack [^()]

ParenthesisString
  = '(' LogTextElement+ ')'

Path
  = $( ('.' / '/') PathChar+ )

PathChar
  = !')' Char
  / ')' !Delimiter

Char = !Delimiter .
  
Delimiter = ' ' / '\r\n' / '\n'

__ = ('\r\n' / [ \t\n])*
