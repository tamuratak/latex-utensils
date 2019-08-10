{
    function simpleLatexConversions(text) {
        return [
            [/---/g, '\u2014'],
            [/--/g, '\u2013'],
            [/~/g, '\u00A0'],
            [/</g, '\u00A1'],
            [/>/g, '\u00BF'],
        ].reduce((output, replacer) => {
            output = output.replace(replacer[0], replacer[1]);
            return output;
        }, text);
    }

    function normalizeWhitespace(textArr) {
        return textArr.reduce((prev, curr) => {
            if (/\s/.test(curr)) {
                if (/\s/.test(prev[prev.length - 1])) {
                    return prev;
                } else {
                    return prev + ' ';
                }
            }
            return prev + curr;
        }, '');
    }
}

File
    = __ r:Node* __ {
        return {
            kind: 'File',
            loc: location(),
            children: r,
        };
    }

Junk
    = '@comment'i [^\n\r]* [\n\r]*
    / [^@] [^\n\r]* [\n\r]*

Node
    = Junk* n:(PreambleExpression / StringExpression / Entry) Junk* { return n; }

//-----------------  Top-level Nodes

Entry
    = '@' type:$[A-Za-z]+ [({] __ id:EntryId? __ props:Property* __ [})] __ {
        return {
            kind: 'Entry',
            id: id || '',
            type: type.toLowerCase(),
            loc: location(),
            properties: props,
        }
    }

PreambleExpression
    = '@preamble'i __ [({] __ v:RegularValue* __ [})] __ {
        return {
            kind: 'PreambleExpression',
            loc: location(),
            value: v.reduce((a, b) => a.concat(b), []),
        }
    }

StringExpression
    = '@string'i __ [({] __ k:VariableName PropertySeparator v:RegularValue+ __ [})] __ {
        return {
            kind: 'StringExpression',
            loc: location(),
            key: k,
            value: v.reduce((a, b) => a.concat(b), []),
        };
    }

//------------------ Entry Child Nodes

EntryId
    = __ id:$[^ \t\r\n,]* __ ',' { return id; }

Property
    = k:PropertyKey PropertySeparator v:PropertyValue PropertyTerminator {
        return {
            kind: 'Property',
            loc: location(),
            key: k.toLowerCase(),
            value: v,
        }
    }

PropertyKey
    = __ k:$[a-zA-Z0-9-_]+ { return k; }

//----------------------- Value Descriptors

PropertyValue
    = Number
    / v:(RegularValue / StringValue)* {
        return v.reduce((a, b) => a.concat(b), []);
    }

RegularValue
    = '"' v:(NestedLiteral / Command / TextNoQuotes)* '"' Concat? { return v; }
    / '{' v:(NestedLiteral / Command / Text)* '}' Concat? { return v; }

StringValue
    = v:String Concat? { return v; }

//---------------------- Value Kinds

Text
    = v:[^{}\\]+ {
        return {
            kind: 'Text',
            loc: location(),
            value: simpleLatexConversions(normalizeWhitespace(v)),
        };
    }

TextNoQuotes
    = v:[^{}"\\]+ {
        return {
            kind: 'Text',
            loc: location(),
            value: simpleLatexConversions(normalizeWhitespace(v)),
        };
    }

Number
    = v:$[0-9]+ {
        return {
            kind: 'Number',
            loc: location(),
            value: parseInt(v, 10),
        };
    }

String
    = v:VariableName {
        return {
            kind: 'String',
            loc: location(),
            value: v,
        };
    }

NestedLiteral
    = '{' v:(Text / Command / NestedLiteral)* '}' {
        return {
            kind: 'NestedLiteral',
            loc: location(),
            value: v,
        };
    }


//---------------- Comments

LineComment
    = '%' __h v:$[^\r\n]+ EOL+ {
        return {
            kind: 'LineComment',
            loc: location(),
            value: v,
        };
    }


//---------------------- LaTeX Commands

Command
    = DicraticalCommand
    / RegularCommand
    / SymbolCommand

DicraticalCommand
    = '\\' mark:SimpleDicratical char:[a-zA-Z0-9] {
        return {
            kind: 'DicraticalCommand',
            loc: location(),
            mark: mark,
            character: char,
        };
    }
    / '\\' mark:ExtendedDicratical '{' char:[a-zA-Z0-9] '}' {
        return {
            kind: 'DicraticalCommand',
            loc: location(),
            mark: mark,
            character: char,
        }
    }


SymbolCommand
    = '\\' v:$[^A-Za-z0-9\t\r\n] {
        return {
            kind: 'SymbolCommand',
            loc: location(),
            value: v,
        };
    }

RegularCommand
    = '\\' v:$[A-Za-z]+ args:Argument* {
        return {
            kind: 'RegularCommand',
            loc: location(),
            value: v,
            arguments: args,
        };
    }

Argument
    = RequiredArgument
    / OptionalArgument

OptionalArgument
    = '[' __h v:$[^\]]+ __h ']' {
        return {
            kind: 'OptionalArgument',
            loc: location(),
            value: v,
        }
    }

RequiredArgument
    = '{' __h v:(Command / Text)* __h '}' {
        return {
            kind: 'RequiredArgument',
            loc: location(),
            value: v,
        }
    }

//-------------- Helpers

VariableName
    = $([a-zA-Z-_][a-zA-Z0-9-_:]+)

SimpleDicratical
    = ['`=~^.]

ExtendedDicratical
    = ['`"c=buv~^.drHk]

PropertySeparator
    = __h '=' __h

PropertyTerminator
    = __ ','? __h (LineComment / EOL)*

Concat
    = __ '#' __

EOL
    = [\r\n]

_h "Mandatory Horizontal Whitespace"
    = [ \t]+

__h "Optional Horizontal Whitespace"
    = [ \t]*

_v "Mandatory Vertical Whitespace"
    = [\r\n]+

__v "Optional Vertical Whitespace"
    = [\r\n]*

_ "Mandatory Whitespace"
    = [ \t\n\r]+

__ "Optional Whitespace"
    = [ \t\n\r]*
