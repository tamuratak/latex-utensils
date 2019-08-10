import {SyntaxErrorBase} from '../pegjs/pegjs_types'

export declare class SyntaxError extends SyntaxErrorBase {}

export type Field = {
    name: string;
    value: FieldValue;
}

export type FieldValue = TextStringValue | NumberValue | AbbreviationValue | ConcatValue

export type Entry = {
    entryType: string;
    content: Field[];
    internalKey?: string;
}

export function isEntry(e: Entry | StringEntry | PreambleEntry): e is Entry {
    return !isStringEntry(e) && !isPreambleEntry(e)
}

export type StringEntry = {
    entryType: 'string';
    abbreviation: string;
    value: TextStringValue | NumberValue;
}

export function isStringEntry(e: Entry | StringEntry | PreambleEntry): e is StringEntry {
    return e.entryType === 'string'
}

export type PreambleEntry = {
    entryType: 'preamble';
    content: TextStringValue | ConcatValue;
}

export function isPreambleEntry(e: Entry | StringEntry | PreambleEntry): e is PreambleEntry {
    return e.entryType === 'preamble'
}

export type TextStringValue = {
    kind: 'value';
    content: string;
}

export function isTextStringValue(e: FieldValue): e is TextStringValue {
    return e.kind === 'value'
}

export type NumberValue = {
    kind: 'number';
    content: string;
}

export function isNumberValue(e: FieldValue): e is NumberValue {
    return e.kind === 'number'
}

export type AbbreviationValue = {
    kind: 'abbreviation';
    content: string;
}

export function isAbbreviationValue(e: FieldValue): e is AbbreviationValue {
    return e.kind === 'abbreviation'
}

export type ConcatValue = {
    kind: 'concat';
    content: ( TextStringValue | NumberValue | AbbreviationValue )[]
}

export function isConcatValue(e: FieldValue): e is ConcatValue {
    return e.kind === 'concat'
}

export type BibtexAst = {
    content: (Entry | StringEntry | PreambleEntry)[];
}

export declare function parse(input: string): BibtexAst
