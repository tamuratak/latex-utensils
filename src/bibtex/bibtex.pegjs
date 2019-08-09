Root
  = __ content:(Entry)* __
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
      return type;
  }

StringEntry
  = '@string'i __ '{' __ 
       name:$([a-zA-Z]+) __ '=' __ value:( CurlyBracketValue / QuotedValue ) __
    '}'
  {
      return { entryType: 'string', content: {abbreviation: name, value} };
  }
  /  '@string'i __ '(' __ 
       name:$([a-zA-Z]+) __ '=' __ value:( CurlyBracketValue / QuotedValue ) __
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
  = fields:(x:Field __ ',' __ { return x; } )* last:Field ','?
  {
      return fields.concat([last]);
  }

Field
  = name:FieldName __ '=' __ value:( CurlyBracketValue / QuotedValue / Number / Abbreviation )
  {
      return { name, value };
  }

FieldName
  = $([^ \t\r\n]+)

Concat
  = (x:(QuotedValue / Abbreviation) __ '#' __ { return x; })+ last:(QuotedValue / Abbreviation)
  {
      return { kind: 'concat', content: x.concat([last]) };
  }

CurlyBracketValue
  = '{' content:$(( escape '{' / escape '}' / CurlyBracketValue / [^}] )*) '}'
  {
      return { kind: 'value', content };
  }

QuotedValue
  = '"' content:$(( CurlyBracketValue / [^"] )*) '"'
  {
      return { kind: 'value', content };
  }

Abbreviation
  = content:$([a-zA-Z]+)
  {
      return { kind: 'abbreviation', content };
  }

Number
  = content:$([0-9]+)
  {
      return { kind: 'number', content };
  }

Name = $([^@={}", \t\r\n]+)

escape = '\\'
__ = ('\r\n' / [ \t\n])*
