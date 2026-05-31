import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { CodeListParserError } from "./../code-list-parser-error.js";
import { CodeListDocumentRef } from "./code-list-document-ref.js";
import { CodeListSetDocumentRef } from "./code-list-set-document-ref.js";
import { DocumentRef } from "./document-ref.js";
import type { CodeListSetDocument } from "./../code-list-set-document.js";

/**
 * An enumerable list of document references.
 */
export class DocumentRefs implements Iterable<DocumentRef> {
    private readonly documentRefs: DocumentRef[] = [];

    /**
     * Creates a new instance of the DocumentRefs class.
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
     */
    getAt(index: number): DocumentRef {
        return this.documentRefs[index]!;
    }

    /**
     * Sets a document reference by index.
     */
    setAt(index: number, documentRef: DocumentRef): void {
        this.documentRefs[index] = documentRef;
    }

    /**
     * Creates a new document reference and adds it to the internal collection.
     */
    add<T extends DocumentRef>(documentRef: T): T {
        this.documentRefs.push(documentRef);
        this.document.metaOnly = false;
        return documentRef;
    }

    /**
     * Removes all document references from the internal collection.
     */
    clear(): void {
        this.documentRefs.length = 0;
    }

    /**
     * Removes the given document reference from the internal collection.
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
     * and adds them to the internal collection.
     */
    parseAndAdd(json: unknown[]): void {
        for (const item of json) {
            if (item == null || typeof item !== "object" || Array.isArray(item)) {
                continue;
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

    [Symbol.iterator](): Iterator<DocumentRef> {
        return this.documentRefs[Symbol.iterator]();
    }
}