import { PropertyNames } from "./dictionaries/property-names.js";
import { SemanticVersion } from "./utils/semantic-version.js";
import { CodeListDocument } from "./code-list-document.js";
import { CodeListParserError } from "./code-list-parser-error.js";
import { CodeListSetDocument } from "./code-list-set-document.js";
import { Document } from "./document.js";

/**
 * A generic OpenCodeList document loader.
 */
export class DocumentLoader {
    private static validateRoot(root: Record<string, unknown>): void {
        const version = root[PropertyNames.OpenCodeList];
        if (typeof version !== "string") {
            throw new CodeListParserError(
                `JSON Property "${PropertyNames.OpenCodeList}" missing.`
            );
        }

        if (SemanticVersion.from(version).compareTo(Document.getVersion()) < 0) {
            throw new CodeListParserError(
                `Version ${version} of OpenCodeList not supported.`
            );
        }
    }

    /**
     * Parses a JSON string into either a CodeListDocument or a CodeListSetDocument.
     */
    static load(jsonText: string): Document {
        const json = JSON.parse(jsonText) as unknown;
        return this.parse(json);
    }

    /**
     * Parses a JSON object into either a CodeListDocument or a CodeListSetDocument.
     */
    static parse(json: unknown): Document {
        if (json == null || typeof json !== "object" || Array.isArray(json)) {
            throw new CodeListParserError("JSON Object expected.");
        }

        const root = json as Record<string, unknown>;
        this.validateRoot(root);

        const codeList = root[PropertyNames.CodeList];
        if (
            codeList != null &&
            typeof codeList === "object" &&
            !Array.isArray(codeList)
        ) {
            return CodeListDocument.parseContent(
                root,
                codeList as Record<string, unknown>
            );
        }

        const codeListSet = root[PropertyNames.CodeListSet];
        if (
            codeListSet != null &&
            typeof codeListSet === "object" &&
            !Array.isArray(codeListSet)
        ) {
            return CodeListSetDocument.parseContent(
                root,
                codeListSet as Record<string, unknown>
            );
        }

        throw new CodeListParserError(
            `JSON Property "${PropertyNames.CodeList}" or "${PropertyNames.CodeListSet}" missing.`
        );
    }
}