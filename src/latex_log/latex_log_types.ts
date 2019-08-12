export type FileStack = {
    kind: 'file_stack';
    content: LatexLogElement[]
}

export function isFileStack(e: LatexLogElement): e is FileStack {
    return e.kind === 'file_stack'
}

export type TexError = {
    kind: 'tex_error';
    message: string;
    line: number;
    command?: string;
}

export function isTexError(e: LatexLogElement): e is TexError {
    return e.kind === 'tex_error'
}

export type LogText = {
    kind: 'text_string';
    content: string
}

export function isLogText(e: LatexLogElement): e is LogText {
    return e.kind === 'text_string'
}

export type PageNumber = {
    kind: 'page_number';
    page: number;
    content?: string
}

export function isPageNumber(e: LatexLogElement): e is PageNumber {
    return e.kind === 'page_number'
}

export type LatexLogElement = FileStack | TexError | LogText | PageNumber

export type LatexLogAst = {
    content: (LogText | FileStack)[]
}
