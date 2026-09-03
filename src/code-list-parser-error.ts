/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

/**
 * Represents an error that occurs while parsing a code list.
 */
export class CodeListParserError extends Error {

    /**
     * Creates a new instance of the CodeListParserError class.
     *
     * @param message - The message value.
     * @returns The new instance.
     */
    constructor(message: string) {
        super(message);
        this.name = 'CodeListParserError';
    }
}
