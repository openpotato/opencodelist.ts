/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./dictionaries/property-names.js";
import { JsonUtils } from "./utils/json-utils.js";
import { Annotation } from "./models/annotation.js";
import { DocumentRefs } from "./models/document-refs.js";
import { Identification } from "./models/identification.js";
import { CodeListBase } from "./code-list-base.js";
import { CodeListParserError } from "./code-list-parser-error.js";

/**
 * A code list set document according to the OpenCodeList specification.
 */
export class CodeListSetDocument extends CodeListBase {
    
    /**
     * Creates a new instance of the CodeListSetDocument class.
     *
     * @returns The new instance.
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
     *
     * @param root - The root value.
     * @returns The parsed instance.
     */
    static parse(root: Record<string, unknown>): CodeListSetDocument {
        const openCodeListVersion = JsonUtils.getRequiredString(root, PropertyNames.OpenCodeList);

        if (!CodeListBase.supportedVersionRange.test(openCodeListVersion)) {
            throw new CodeListParserError(
                `Unsupported OpenCodeList version '${openCodeListVersion}'.`
            );
        }        

        if (root[PropertyNames.CodeList] !== undefined) {
            throw new CodeListParserError(`OpenCodeList document must contain exactly one of "${PropertyNames.CodeList}" or "${PropertyNames.CodeListSet}".`);
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
     *
     * @param root - The root value.
     * @param codeListSet - The codeListSet value.
     * @returns The operation result.
     */
    static parseContent(
        root: Record<string, unknown>,
        codeListSet: Record<string, unknown>
    ): CodeListSetDocument {
        const document = new CodeListSetDocument();

        const comments = JsonUtils.getStringArray(root, PropertyNames.Comments);
        if (comments !== undefined) {
            document.comments.push(...comments);
        }

        const annotation = JsonUtils.getObject(codeListSet, PropertyNames.Annotation);
        if (annotation !== undefined) {
            document.annotation = Annotation.parse(annotation);
        }

        document.identification = Identification.parse(
            JsonUtils.getRequiredObject(codeListSet, PropertyNames.Identification)
        );

        const referenceSet = JsonUtils.getArray(codeListSet, PropertyNames.ReferenceSet);
        if (referenceSet !== undefined) {
            document.metaOnly = false;
            document.documentRefs.parseAndAdd(referenceSet);
        }

        return document;
    }

    /**
     * Clears only the content of this document instance.
     *
     * @param convertToMetaOnly - The convertToMetaOnly value.
     * @returns No return value.
     */
    override clearContent(convertToMetaOnly: boolean): void {
        this.documentRefs.clear();
        super.clearContent(convertToMetaOnly);
    }

    /**
     * Converts the document to JSON.
     *
     * @returns The JSON representation.
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
            [PropertyNames.OpenCodeList]: CodeListBase.implementedVersion.toString(),
            [PropertyNames.CodeListSet]: codeListSet,
        };

        if (this.comments.length > 0) {
            root[PropertyNames.Comments] = [...this.comments];
        }

        return root;
    }
}