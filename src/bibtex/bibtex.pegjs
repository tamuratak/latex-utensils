{
  const timeKeeper = options.timeout;
}

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
      timeKeeper && timeKeeper.check();
      return x;
  }
  / Comment+ x:Entry __
  {
      timeKeeper && timeKeeper.check();
      return x;
  }

Entry = StringEntry / PreambleEntry / BasicEntry

BasicEntry
  = entryType:EntryType __ '{' __ internalKey:InternalKey? skip_comment
      fields:FieldArray? skip_comment
    '}'
  {
      return { entryType, content: fields || [], internalKey: internalKey || undefined, location: location() };
  }
  / entryType:EntryType __ '(' __ internalKey:InternalKey? skip_comment
      fields:FieldArray? skip_comment
    ')'
  {
      return { entryType, content: fields || [], internalKey: internalKey || undefined, location: location() };
  }

StringEntry
  = '@string'i __ '{' __ 
       name:AbbreviationName __ '=' __ value:( Concat / CurlyBracketValue / QuotedValue / Number ) __
    '}'
  {
      return { entryType: 'string', abbreviation: name, value, location: location() };
  }
  /  '@string'i __ '(' __ 
       name:AbbreviationName __ '=' __ value:( Concat / CurlyBracketValue / QuotedValue / Number  ) __
    ')'
  {
      return { entryType: 'string', abbreviation: name, value, location: location() };
  }

PreambleEntry
  = '@preamble'i __ '{' __
       content:( Concat / CurlyBracketValue / QuotedValue ) __
    '}'
  {
      return { entryType: 'preamble', content, location: location() };
  }
  / '@preamble'i __ '(' __
       content:( Concat / CurlyBracketValue / QuotedValue ) __
    ')'
  {
      return { entryType: 'preamble', content, location: location() };
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
  = begin:Field fields:( skip_comment ',' skip_comment x:Field { return x; } )* skip_comment ','?
  {
      return [begin].concat(fields);
  }

Field
  = name:FieldName __ '=' __ value:( Concat / CurlyBracketValue / QuotedValue / Number / Abbreviation )
  {
      return { name, value, location: location() };
  }

FieldName = NameToLowerCase

Concat
  = begin:ConcatElement rest:(__ '#' __ x:ConcatElement { return x; })+
  {
      return { kind: 'concat', content: [begin].concat(rest), location: location() };
  }

ConcatElement = CurlyBracketValue / QuotedValue / Number / Abbreviation

CurlyBracketValue
  = '{' content:$(( '\\{' / '\\}' / CurlyBracketValue / [^}] )*) '}'
  {
      return { kind: 'text_string', content, location: location() };
  }

QuotedValue
  = '"' content:$(( '\\{' / '\\}' / CurlyBracketValue / [^"] )*) '"'
  {
      return { kind: 'text_string', content, location: location() };
  }

Abbreviation
  = content:AbbreviationName
  {
      return { kind: 'abbreviation', content, location: location() };
  }

Number
  = content:$([-0-9]+)
  {
      return { kind: 'number', content, location: location() };
  }

AbbreviationName = Name

NameToLowerCase
  = n:Name
  {
      return n.toLowerCase();
  }

Name = $([^%@={}()"'#, \t\r\n]+)

__ = [ \t\r\n]*

skip_comment = ([ \t\r\n]+ / '%' [^\n]* '\n')*
