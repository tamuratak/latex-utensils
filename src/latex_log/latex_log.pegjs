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
  = '(' path:Path  content:FileStackElement* ')'
  {
      return { path, content };
  }

FileStackElement
  = $(LogTextElement+)
  / Delimiter x:FileStack
  {
      return x;
  }

LogTextElement
  = Delimiter !FileStack ParenthesisString
  / ( !(Delimiter? FileStack) [^())] )

ParenthesisString
  = '(' [^)]+ ')'

Path
  = $( ('.' / '/') (!Delimiter [^)])+ )
  
Delimiter = ' ' / '\r\n' / '\n'

__ = ('\r\n' / [ \t\n])*
