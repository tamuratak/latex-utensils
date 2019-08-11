Root
  = content:(EachEntry)* Comment*
  {
      return { content };
  }

Comment
  = '@comment'i __ '{' ( QuotedValue / CurlyBracketValue / [^}] )* '}'
  / '@comment'i __ '(' ( QuotedValue / CurlyBracketValue / [^}] )* ')'
  / QuotedValue
  / CurlyBracketValue
  / !Entry [^@]

EachEntry
  = x:Entry __
  {
      return x;
  }
  / Comment+ x:Entry __
  {
      return x;
  }

Entry = StringEntry / PreambleEntry / BasicEntry

BasicEntry
  = entryType:EntryType __ '{' __ internalKey:InternalKey? __
      fields:FieldArray? __
    '}'
  {
      return { entryType, content: fields || [], internalKey: internalKey || undefined };
  }
  / entryType:EntryType __ '(' __ internalKey:InternalKey? __
      fields:FieldArray? __
    ')'
  {
      return { entryType, content: fields || [], internalKey: internalKey || undefined };
  }

StringEntry
  = '@string'i __ '{' __ 
       name:AbbreviationName __ '=' __ value:( Concat / CurlyBracketValue / QuotedValue / Number ) __
    '}'
  {
      return { entryType: 'string', abbreviation: name, value };
  }
  /  '@string'i __ '(' __ 
       name:AbbreviationName __ '=' __ value:( Concat / CurlyBracketValue / QuotedValue / Number  ) __
    ')'
  {
      return { entryType: 'string', abbreviation: name, value };
  }

PreambleEntry
  = '@preamble'i __ '{' __
       content:( Concat / CurlyBracketValue / QuotedValue ) __
    '}'
  {
      return { entryType: 'preamble', content };
  }
  / '@preamble'i __ '(' __
       content:( Concat / CurlyBracketValue / QuotedValue ) __
    ')'
  {
      return { entryType: 'preamble', content };
  }

EntryType
  = '@' type:$([a-zA-Z]+)
  {
      return type.toLowerCase();
  }

InternalKey
  = ','
  {
      return undefined;
  }
  / name:Name __ ','
  {
      return name;
  }

FieldArray
  = begin:Field fields:( __ ',' __ x:Field { return x; } )* __ ','?
  {
      return [begin].concat(fields);
  }

Field
  = name:FieldName __ '=' __ value:( Concat / CurlyBracketValue / QuotedValue / Number / Abbreviation )
  {
      return { name, value };
  }

FieldName = NameToLowerCase

Concat
  = begin:ConcatElement rest:(__ '#' __ x:ConcatElement { return x; })+
  {
      return { kind: 'concat', content: [begin].concat(rest) };
  }

ConcatElement = CurlyBracketValue / QuotedValue / Number / Abbreviation

CurlyBracketValue
  = '{' content:$(( '\\{' / '\\}' / CurlyBracketValue / [^}] )*) '}'
  {
      return { kind: 'text_string', content };
  }

QuotedValue
  = '"' content:$(( '\\{' / '\\}' / CurlyBracketValue / [^"] )*) '"'
  {
      return { kind: 'text_string', content };
  }

Abbreviation
  = content:AbbreviationName
  {
      return { kind: 'abbreviation', content };
  }

Number
  = content:$([0-9]+)
  {
      return { kind: 'number', content };
  }

AbbreviationName = $([a-zA-Z0-9_:-]+)

NameToLowerCase
  = n:Name
  {
      return n.toLowerCase();
  }

Name = $([^@={}", \t\r\n]+)

__ = ('\r\n' / [ \t\n])*
