export = Tracer
declare class Tracer {
    constructor(
        text: string,
        options?: {
            parent?: any;
            useColor?: boolean;
            showSource?: boolean;
            maxSourceLines?: number;
            showTrace?: boolean;
            showFullPath?: boolean;
            maxPathLength?: number;
            hiddenPaths?: string[];
            matchesNode?: any;
        }
    )
    trace(arg: any): any;
    getBacktraceString(): string;
}
