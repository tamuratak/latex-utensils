import {Location} from './latex_parser_types'

export class SyntaxError extends Error {
    message: string
    expected: string | null
    found: string | null
    location: Location
    name: 'SyntaxError'
}
