/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./dictionaries/property-names.js";
import { SemanticVersion } from "./utils/semantic-version.js";
import { Annotation } from "./models/annotation.js";
import { DocumentRefs } from "./models/document-refs.js";
import { Identification } from "./models/identification.js";
import { CodeListParserError } from "./code-list-parser-error.js";
import { Document } from "./document.js";

/**
 * A code list set document according to the OpenCodeList specification.
 */
export class CodeListSetDocument extends Document {
    
    /**
     * Creates a new instance of the CodeListSetDocument class.
     */
    constructor() {
        super();
        this.documentRefs = new DocumentRefs(this);
    }

    /**
     * The list of document references.
     */
    public readonly documentRefs: DocumentRefs;

    /**
     * Creates a document from a JSON object.
     */
    static parse(root: Record<string, unknown>): CodeListSetDocument {
        const version = root[PropertyNames.OpenCodeList];

        if (typeof version !== "string") {
            throw new CodeListParserError(
                `JSON Property "${PropertyNames.OpenCodeList}" missing.`
            );
        }

        if (
            SemanticVersion.from(version).compareTo(
                Document.getMinimumCompatibleVersion()
            ) < 0
        ) {
            throw new CodeListParserError(
                `Version ${version} of OpenCodeList not supported.`
            );
        }

        const codeListSet = root[PropertyNames.CodeListSet];

        if (
            codeListSet == null ||
            typeof codeListSet !== "object" ||
            Array.isArray(codeListSet)
        ) {
            throw new CodeListParserError(
                `JSON Property "${PropertyNames.CodeListSet}" missing.`
            );
        }

        return CodeListSetDocument.parseContent(
            root,
            codeListSet as Record<string, unknown>
        );
    }

    /**
     * Parses the inner code list set object.
     */
    static parseContent(
        root: Record<string, unknown>,
        codeListSet: Record<string, unknown>
    ): CodeListSetDocument {
        const document = new CodeListSetDocument();

        const comments = root[PropertyNames.Comments];
        if (Array.isArray(comments)) {
            for (const comment of comments) {
                if (typeof comment === "string") {
                    document.comments.push(comment);
                }
            }
        }

        const annotation = codeListSet[PropertyNames.Annotation];
        if (
            annotation != null &&
            typeof annotation === "object" &&
            !Array.isArray(annotation)
        ) {
            document.annotation = Annotation.parse(
                annotation as Record<string, unknown>
            );
        }

        const identification = codeListSet[PropertyNames.Identification];
        if (
            identification == null ||
            typeof identification !== "object" ||
            Array.isArray(identification)
        ) {
            throw new CodeListParserError(
                `Missing required property '${PropertyNames.Identification}'.`
            );
        }

        document.identification = Identification.parse(
            identification as Record<string, unknown>
        );

        const referenceSet = codeListSet[PropertyNames.ReferenceSet];
        if (Array.isArray(referenceSet)) {
            document.documentRefs.parseAndAdd(referenceSet);
        }

        return document;
    }

    /**
     * Clears only the content of this document instance.
     */
    override clearContent(convertToMetaOnly: boolean): void {
        this.documentRefs.clear();
        super.clearContent(convertToMetaOnly);
    }

    /**
     * Converts the document to JSON.
     */
    override toJSON(metaOnly = this.metaOnly): Record<string, unknown> {
        const codeListSet: Record<string, unknown> = {
            [PropertyNames.Identification]: this.identification.toJSON(),
        };

        if (this.annotation != null) {
            codeListSet[PropertyNames.Annotation] = this.annotation.toJSON();
        }

        if (!metaOnly) {
            codeListSet[PropertyNames.ReferenceSet] = [...this.documentRefs].map((x) => x.toJSON());
        }

        const root: Record<string, unknown> = {
            [PropertyNames.OpenCodeList]: Document.getMinimumCompatibleVersion().toString(),
            [PropertyNames.CodeListSet]: codeListSet,
        };

        if (this.comments.length > 0) {
            root[PropertyNames.Comments] = [...this.comments];
        }

        return root;
    }
}