/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { JsonUtils } from "./utils/json-utils.js";
import { PropertyNames } from "./dictionaries/property-names.js";
import { CodeListBase } from "./code-list-base.js";
import { CodeListDocument } from "./code-list-document.js";
import { CodeListParserError } from "./code-list-parser-error.js";
import { CodeListSetDocument } from "./code-list-set-document.js";

/**
 * A generic OpenCodeList document loader.
 */
export class CodeListLoader {

    /**
     * Parses a JSON string into either a CodeListDocument or a CodeListSetDocument.
     *
     * @param jsonText - The jsonText value.
     * @returns The operation result.
     */
    static load(jsonText: string): CodeListBase {
        const json = JSON.parse(jsonText) as unknown;
        return this.parse(json);
    }

    /**
     * Parses a JSON object into either a CodeListDocument or a CodeListSetDocument.
     *
     * @param json - The json value.
     * @returns The parsed instance.
     */
    static parse(json: unknown): CodeListBase {
        if (json == null || typeof json !== "object" || Array.isArray(json)) {
            throw new CodeListParserError("JSON Object expected.");
        }

        const root = json as Record<string, unknown>;
        this.validateVersion(root);

        const hasCodeList = Object.prototype.hasOwnProperty.call(root, PropertyNames.CodeList);
        const hasCodeListSet = Object.prototype.hasOwnProperty.call(root, PropertyNames.CodeListSet);

        if (hasCodeList === hasCodeListSet) {
            throw new CodeListParserError(
                `OpenCodeList document must contain exactly one of "${PropertyNames.CodeList}" or "${PropertyNames.CodeListSet}".`
            );
        }

        if (hasCodeList) {
            const codeList = JsonUtils.getRequiredObject(root, PropertyNames.CodeList);
            return CodeListDocument.parseContent(root, codeList);
        }

        const codeListSet = JsonUtils.getRequiredObject(root, PropertyNames.CodeListSet);
        return CodeListSetDocument.parseContent(root, codeListSet);
    }

    /*
     * Validates the OpenCodeList version in the root JSON object.
     *
     * @param root The root JSON object.
     */
    private static validateVersion(root: Record<string, unknown>): void {
        const openCodeListVersion = JsonUtils.getRequiredString(root, PropertyNames.OpenCodeList);

        if (!CodeListBase.supportedVersionRange.test(openCodeListVersion)) {
            throw new CodeListParserError(
                `Unsupported OpenCodeList version '${openCodeListVersion}'.`
            );
        }
    }
}