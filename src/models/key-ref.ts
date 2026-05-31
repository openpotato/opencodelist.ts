import { CodeListDocumentRef } from "./code-list-document-ref.js";
import { PropertyNames } from "./../dictionaries/property-names.js";

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

        const codeListRef = json[PropertyNames.CodeListRef];
        if (
            codeListRef == null ||
            typeof codeListRef !== "object" ||
            Array.isArray(codeListRef)
        ) {
            throw new Error(`Missing required property '${PropertyNames.CodeListRef}'.`);
        }
        reference.codeListRef = CodeListDocumentRef.parse(
            codeListRef as Record<string, unknown>
        );

        const keyId = json[PropertyNames.KeyId];
        if (typeof keyId !== "string") {
            throw new Error(`Missing required property '${PropertyNames.KeyId}'.`);
        }
        reference.keyId = keyId;

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