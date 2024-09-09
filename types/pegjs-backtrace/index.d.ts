export = Tracer
declare class Tracer {
    constructor(
        text: string,
        options?: {
            parent?: unknown;
            useColor?: boolean;
            showSource?: boolean;
            maxSourceLines?: number;
            showTrace?: boolean;
            showFullPath?: boolean;
            maxPathLength?: number;
            hiddenPaths?: string[];
            matchesNode?: unknown;
        }
    )
    trace(arg: unknown): unknown
    getBacktraceString(): string
}
