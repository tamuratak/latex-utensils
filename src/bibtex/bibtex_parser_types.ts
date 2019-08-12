import {Location} from '../pegjs/pegjs_types'

export type Field = {
    name: string;
    value: FieldValue;
    location: Location;
}

export type FieldValue = TextStringValue | NumberValue | AbbreviationValue | ConcatValue

export type Entry = {
    entryType: string;
    content: Field[];
    internalKey?: string;
    location: Location;
}

export function isEntry(e: Entry | StringEntry | PreambleEntry): e is Entry {
    return !isStringEntry(e) && !isPreambleEntry(e)
}

export type StringEntry = {
    entryType: 'string';
    abbreviation: string;
    value: TextStringValue | NumberValue;
    location: Location;
}

export function isStringEntry(e: Entry | StringEntry | PreambleEntry): e is StringEntry {
    return e.entryType === 'string'
}

export type PreambleEntry = {
    entryType: 'preamble';
    content: TextStringValue | ConcatValue;
    location: Location;
}

export function isPreambleEntry(e: Entry | StringEntry | PreambleEntry): e is PreambleEntry {
    return e.entryType === 'preamble'
}

export type TextStringValue = {
    kind: 'text_string';
    content: string;
    location: Location;
}

export function isTextStringValue(e: FieldValue): e is TextStringValue {
    return e.kind === 'text_string'
}

export type NumberValue = {
    kind: 'number';
    content: string;
    location: Location;
}

export function isNumberValue(e: FieldValue): e is NumberValue {
    return e.kind === 'number'
}

export type AbbreviationValue = {
    kind: 'abbreviation';
    content: string;
    location: Location;
}

export function isAbbreviationValue(e: FieldValue): e is AbbreviationValue {
    return e.kind === 'abbreviation'
}

export type ConcatValue = {
    kind: 'concat';
    content: ( TextStringValue | NumberValue | AbbreviationValue )[];
    location: Location;
}

export function isConcatValue(e: FieldValue): e is ConcatValue {
    return e.kind === 'concat'
}

export type BibtexAst = {
    content: (Entry | StringEntry | PreambleEntry)[];
}
