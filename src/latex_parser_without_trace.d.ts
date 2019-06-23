import {ParserOptions, LatexAst, Location} from './latex_parser_types'

export declare class SyntaxError extends Error {
    message: string;
    expected: string | null;
    found: string | null;
    location: Location;
    name : 'SyntaxError';
}
  
export declare function parse(input: string, options?: ParserOptions): LatexAst;
