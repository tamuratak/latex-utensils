Root
  = __ content:(Entry)*
  {
      return { kind: 'ast.root', content };
  }


Comment
  = QuotedValue
  / CurlyBracketValue
  / '@comment'i __ '{' ( QuotedValue / CurlyBracketValue / [^}] )* '}'
  / '@comment'i __ '(' ( QuotedValue / CurlyBracketValue / [^}] )* ')'
  / [^@]

Entry
  = x:Entry_p __
  {
      return x;
  }
  / Comment+ ( ' ' / '\r\n' / '\n' ) x:Entry_p __
  {
      return x;
  }

Entry_p
  = entryType:EntryType __ '{' __ internalKey:InternalKey? __
      fields:FieldArray? __
    '}'
  {
      return { entryType, content: fields || [], internalKey };
  }
  / entryType:EntryType __ '(' __ internalKey:InternalKey? __
      fields:FieldArray? __
    ')'
  {
      return { entryType, content: fields || [], internalKey };
  }

EntryType
  = '@' type:$([a-zA-Z]+)
  {
      return type.toLowerCase();
  }

StringEntry
  = '@string'i __ '{' __ 
       name:AbbreviationName __ '=' __ value:( CurlyBracketValue / QuotedValue / Number ) __
    '}'
  {
      return { entryType: 'string', content: {abbreviation: name, value} };
  }
  /  '@string'i __ '(' __ 
       name:AbbreviationName __ '=' __ value:( CurlyBracketValue / QuotedValue / Number ) __
    ')'
  {
      return { entryType: 'string', content: {abbreviation: name, value} };
  }

PreambleEntry
  = '@preamble'i __ '{' __
       content:( CurlyBracketValue / QuotedValue / Concat ) __
    '}'
  {
      return { entryType: 'preamble', content };
  }
  / '@preamble'i __ '(' __
       value:( CurlyBracketValue / QuotedValue / Concat ) __
    ')'
  {
      return { entryType: 'preamble', content };
  }

InternalKey
  = name:Name __ ','
  {
      return name;
  }

FieldArray
  = fields:(x:Field __ ',' __ { return x; } )* last:Field __ ','?
  {
      return fields.concat([last]);
  }

Field
  = name:FieldName __ '=' __ value:( CurlyBracketValue / QuotedValue / Number / Abbreviation / Concat )
  {
      return { name, value };
  }

FieldName = Name

Concat
  = x:(ConcatElement __ '#' __ { return x; })+ last:ConcatElement
  {
      return { kind: 'concat', content: x.concat([last]) };
  }

ConcatElement = CurlyBracketValue / QuotedValue / Number / Abbreviation

CurlyBracketValue
  = '{' content:$(( '\\{' / '\\}' / CurlyBracketValue / [^}] )*) '}'
  {
      return { kind: 'value', content };
  }

QuotedValue
  = '"' content:$(( CurlyBracketValue / [^"] )*) '"'
  {
      return { kind: 'value', content };
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

AbbreviationName = $([a-zA-Z]+)

Name
  = name:$([^@={}", \t\r\n]+)
  {
      return name.toLowerCase();
  }

__ = ('\r\n' / [ \t\n])*
