export type FileStack = {
    kind: 'file_stack';
    content: (FileStack | LogText | PageNumber)[]
}

export function isFileStack(e: FileStack | LogText | PageNumber): e is FileStack {
    return e.kind === 'file_stack'
}

export type LogText = {
    kind: 'text_string';
    content: string
}

export function isLogText(e: FileStack | LogText | PageNumber): e is LogText {
    return e.kind === 'text_string'
}

export type PageNumber = {
    kind: 'page_number';
    page: number;
    content?: string
}

export function isPageNumber(e: FileStack | LogText | PageNumber): e is PageNumber {
    return e.kind === 'page_number'
}

export type LatexLogAst = {
    content: (LogText | FileStack)[]
}
