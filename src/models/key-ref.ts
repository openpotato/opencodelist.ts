/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { CodeListDocumentRef } from "./code-list-document-ref.js";

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
     */
    static parse(json: Record<string, unknown>): KeyRef {
        const reference = new KeyRef();

        reference.codeListRef = CodeListDocumentRef.parse(
            JsonUtils.getRequiredObject(json, PropertyNames.CodeListRef)
        );

        reference.keyId = JsonUtils.getRequiredString(json, PropertyNames.KeyId);

        return reference;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        return {
            [PropertyNames.CodeListRef]: this.codeListRef.toJSON(),
            [PropertyNames.KeyId]: this.keyId,
        };
    }
}