Root
  = __ content:Entry* __
  {
      return { kind: 'ast.root', content };
  }

Entry
  = entryType:EntryType __ '{' __ internalKey:InternalKey? __
      fields:FieldArray? __
    '}'
  {
      return { entryType, fields: fields || [], internalKey };
  }
  / entryType:EntryType __ '(' __ internalKey:InternalKey? __
      fields:FieldArray? __
    ')'
  {
      return { entryType, fields: fields || [], internalKey };
  }
    

EntryType
  = '@' type:$([a-zA-Z]+)
  {
      return type;
  }

InternalKey
  = name:Name __ ','
  {
      return name
  }

FieldArray
  = fields:(x:Field __ ',' __ { return x; } )* last:Field
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
