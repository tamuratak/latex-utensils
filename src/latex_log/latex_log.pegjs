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
  = '(' path:Path  content:FileStackElement+ ')'
  {
      return { path, content };
  }

FileStackElement
  = $(( !(Delimiter FileStack) [^)] )+)
  / Delimiter x:FileStack
  {
      return x;
  }

Path
  = $( ('.' / '/') (!Delimiter .)+ )
  
Delimiter = ' ' / '\r\n' / '\n'

__ = ('\r\n' / [ \t\n])*
