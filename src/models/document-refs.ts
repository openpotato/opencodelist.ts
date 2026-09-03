/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { CodeListParserError } from "./../code-list-parser-error.js";
import { CodeListSetDocument } from "./../code-list-set-document.js";
import { CodeListSetDocumentRef } from "./code-list-set-document-ref.js";
import { CodeListDocumentRef } from "./code-list-document-ref.js";
import { DocumentRef } from "./document-ref.js";

/**
 * An enumerable list of document references.
 */
export class DocumentRefs implements Iterable<DocumentRef> {
    /**
     * The document reference instances.
     */
    private readonly documentRefs: DocumentRef[] = [];

    /**
     * Creates a new instance of the DocumentRefs class.
     *
     * @returns The new instance.
     */
    constructor(private readonly document: CodeListSetDocument) { }

    /**
     * Number of document references.
     */
    get count(): number {
        return this.documentRefs.length;
    }

    /**
     * Gets a document reference by index.
     *
     * @param index - The index value.
     * @returns The DocumentRef instance.
     */
    getAt(index: number): DocumentRef {
        return this.documentRefs[index]!;
    }

    /**
     * Sets a document reference by index.
     *
     * @param index - The index value.
     * @param documentRef - The DocumentRef instance.
     * @returns No return value.
     */
    setAt(index: number, documentRef: DocumentRef): void {
        this.documentRefs[index] = documentRef;
    }

    /**
     * Creates a new document reference and adds it to the internal collection.
     *
     * @param documentRef - The DocumentRef instance.
     * @returns The DocumentRef instance.
     */
    add<T extends DocumentRef>(documentRef: T): T {
        this.documentRefs.push(documentRef);
        this.document.metaOnly = false;
        return documentRef;
    }

    /**
     * Removes all document references from the internal collection.
     *
     * @returns No return value.
     */
    clear(): void {
        this.documentRefs.length = 0;
    }

    /**
     * Removes the given document reference from the internal collection.
     *
     * @param documentRef - The DocumentRef instance.
     * @returns True if the document reference was removed; otherwise, false.
     */
    remove(documentRef: DocumentRef): boolean {
        const index = this.documentRefs.indexOf(documentRef);

        if (index === -1) {
            return false;
        }

        this.documentRefs.splice(index, 1);
        return true;
    }

    /**
     * Parses a JSON array into new DocumentRef instances
     *
     * @param json - The json value.
     * @returns No return value.
     */
    parseAndAdd(json: unknown[]): void {
        for (const item of json) {
            if (item == null || typeof item !== "object" || Array.isArray(item)) {
                throw new CodeListParserError("Document reference must be an object.");
            }

            const jsonObject = item as Record<string, unknown>;
            const type = jsonObject[PropertyNames.Type];

            if (typeof type !== "string") {
                throw new CodeListParserError("Type column is missing.");
            }

            if (type === TypeConsts.CodeListRef) {
                this.add(CodeListDocumentRef.parse(jsonObject));
            } else if (type === TypeConsts.CodeListSetRef) {
                this.add(CodeListSetDocumentRef.parse(jsonObject));
            } else {
                throw new CodeListParserError(`Unknown column type "${type}".`);
            }
        }
    }

    /**
     * Allows iteration over the document references in the internal collection.
     * 
     * @returns An iterator over the document references.
     */
    [Symbol.iterator](): Iterator<DocumentRef> {
        return this.documentRefs[Symbol.iterator]();
    }
}