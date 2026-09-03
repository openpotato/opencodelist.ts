/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { CodeListDocumentRef } from "./code-list-document-ref.js";
import { CodeListParserError } from "./../code-list-parser-error.js";

/**
 * Reference to a key in an external code list.
 */
export class KeyRef {

    /**
     * Reference to an external code list.
     */
    public codeListRef!: CodeListDocumentRef;

    /**
     * Reference to a key ID in the external code list.
     */
    public keyId!: string;

    /**
     * Parses a JSON object into a KeyRef instance.
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): KeyRef {
        const reference = new KeyRef();

        const codeListRefJson = JsonUtils.getRequiredObject(json, PropertyNames.CodeListRef);
        if (codeListRefJson[PropertyNames.Type] !== undefined || codeListRefJson[PropertyNames.Annotation] !== undefined) {
            throw new CodeListParserError("Foreign-key codeListRef must not contain 'type' or 'annotation'.");
        }

        reference.codeListRef = CodeListDocumentRef.parse(codeListRefJson);
        reference.keyId = JsonUtils.getRequiredString(json, PropertyNames.KeyId);

        return reference;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    toJSON(): Record<string, unknown> {
        return {
            [PropertyNames.CodeListRef]: this.codeListRef.toJSON(false),
            [PropertyNames.KeyId]: this.keyId,
        };
    }
}