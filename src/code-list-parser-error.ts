/**
 * Represents an error that occurs while parsing a code list.
 */
export class CodeListParserError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CodeListParserError';
    }
}
