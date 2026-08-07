/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { gt, lt, valid } from "semver";
import { PropertyNames } from "./dictionaries/property-names.js";
import { Annotation } from "./models/annotation.js";
import { Columns } from "./models/columns.js";
import { ForeignKeys } from "./models/foreign-keys.js";
import { Identification } from "./models/identification.js";
import { Key } from "./models/key.js";
import { Keys } from "./models/keys.js";
import { Rows } from "./models/rows.js";
import { CodeListParserError } from "./code-list-parser-error.js";
import { Document } from "./document.js";
import { JsonUtils } from "./utils/json-utils.js";

/**
 * A code list document according to the OpenCodeList specification.
 */
export class CodeListDocument extends Document {

    /**
     * Creates a new instance of the CodeListDocument class.
     */
    constructor() {
        super();
        this.columns = new Columns(this);
        this.keys = new Keys(this);
        this.foreignKeys = new ForeignKeys(this);
        this.rows = new Rows(this);
    }

    /**
     * The column set of the code list.
     */
    public readonly columns: Columns;

    /**
     * The default key of the code list.
     */
    public defaultKey: Key | null = null;

    /**
     * List of foreign keys.
     */
    public readonly foreignKeys: ForeignKeys;

    /**
     * List of keys.
     */
    public readonly keys: Keys;

    /**
     * The data rows of the code list.
     */
    public readonly rows: Rows;

    /**
     * Creates a document from a JSON object.
     */
    static parse(root: Record<string, unknown>): CodeListDocument {
        const version = root[PropertyNames.OpenCodeList];

        const openCodeListVersion = JsonUtils.getRequiredString(root, PropertyNames.OpenCodeList);
        
        if (
            valid(openCodeListVersion) == null ||
            lt(openCodeListVersion, Document.getMinimumCompatibleVersion()) ||
            gt(openCodeListVersion, Document.getImplementedVersion())
        ) {
            throw new CodeListParserError(
                `Unsupported OpenCodeList version '${openCodeListVersion}'.`
            );
        }        

        const codeList = root[PropertyNames.CodeList];

        if (
            codeList == null ||
            typeof codeList !== "object" ||
            Array.isArray(codeList)
        ) {
            throw new CodeListParserError(
                `JSON Property "${PropertyNames.CodeList}" missing.`
            );
        }

        return CodeListDocument.parseContent(
            root,
            codeList as Record<string, unknown>
        );
    }

    /**
     * Parses the inner code list object.
     */
    static parseContent(
        root: Record<string, unknown>,
        codeList: Record<string, unknown>
    ): CodeListDocument {
        const document = new CodeListDocument();

        const comments = root[PropertyNames.Comments];
        if (Array.isArray(comments)) {
            for (const comment of comments) {
                if (typeof comment === "string") {
                    document.comments.push(comment);
                }
            }
        }

        const annotation = codeList[PropertyNames.Annotation];
        if (
            annotation != null &&
            typeof annotation === "object" &&
            !Array.isArray(annotation)
        ) {
            document.annotation = Annotation.parse(
                annotation as Record<string, unknown>
            );
        }

        const identification = codeList[PropertyNames.Identification];
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

        const columnSet = codeList[PropertyNames.ColumnSet];
        if (
            columnSet != null &&
            typeof columnSet === "object" &&
            !Array.isArray(columnSet)
        ) {
            const cs = columnSet as Record<string, unknown>;

            const columns = cs[PropertyNames.Columns];
            if (Array.isArray(columns)) {
                document.columns.parseAndAdd(columns);
            }

            const keys = cs[PropertyNames.Keys];
            if (Array.isArray(keys)) {
                document.keys.parseAndAdd(keys);
            }

            const defaultKey = cs[PropertyNames.DefaultKey];
            if (
                defaultKey != null &&
                typeof defaultKey === "object" &&
                !Array.isArray(defaultKey)
            ) {
                const keyId = (
                    defaultKey as Record<string, unknown>
                )[PropertyNames.KeyId];

                if (typeof keyId === "string") {
                    const key = document.keys.tryFind(
                        (x) => x.id === keyId
                    );

                    if (key == null) {
                        throw new CodeListParserError(
                            `Key Id "${keyId}" not found.`
                        );
                    }

                    document.defaultKey = key;
                }
            }

            const foreignKeys = cs[PropertyNames.ForeignKeys];
            if (Array.isArray(foreignKeys)) {
                document.foreignKeys.parseAndAdd(foreignKeys);
            }
        }

        const dataSet = codeList[PropertyNames.DataSet];
        if (
            dataSet != null &&
            typeof dataSet === "object" &&
            !Array.isArray(dataSet)
        ) {
            const rows = (
                dataSet as Record<string, unknown>
            )[PropertyNames.Rows];

            if (Array.isArray(rows)) {
                document.rows.parseAndAdd(rows);
            }
        }

        return document;
    }

    /**
     * Clears the metadata and content of this document instance.
     */
    override clear(): void {
        super.clear();

        this.defaultKey = null;
        this.columns.clear();
        this.keys.clear();
        this.foreignKeys.clear();
    }

    /**
     * Clears only the content of this document instance.
     */
    override clearContent(convertToMetaOnly: boolean): void {
        this.rows.clear();
        super.clearContent(convertToMetaOnly);
    }

    /**
     * Converts the document to JSON.
     */
    override toJSON(metaOnly = this.metaOnly): Record<string, unknown> {
        const codeList: Record<string, unknown> = {
            [PropertyNames.Identification]: this.identification.toJSON(),
        };

        if (this.annotation != null) {
            codeList[PropertyNames.Annotation] = this.annotation.toJSON();
        }

        const columnSet: Record<string, unknown> = {
            [PropertyNames.Columns]: [...this.columns].map((x) => x.toJSON()),
        };

        if (this.keys.count > 0) {
            columnSet[PropertyNames.Keys] = [...this.keys].map((x) => x.toJSON());
        }

        if (this.defaultKey != null) {
            columnSet[PropertyNames.DefaultKey] = {
                [PropertyNames.KeyId]: this.defaultKey.id,
            };
        }

        if (this.foreignKeys.count > 0) {
            columnSet[PropertyNames.ForeignKeys] = [...this.foreignKeys].map((x) => x.toJSON());
        }

        codeList[PropertyNames.ColumnSet] = columnSet;

        if (!metaOnly) {
            codeList[PropertyNames.DataSet] = {
                [PropertyNames.Rows]: [...this.rows].map((x) => x.toJSON()),
            };
        }

        const root: Record<string, unknown> = {
            [PropertyNames.OpenCodeList]: Document.getImplementedVersion().toString(),
            [PropertyNames.CodeList]: codeList,
        };

        if (this.comments.length > 0) {
            root[PropertyNames.Comments] = [...this.comments];
        }

        return root;
    }
}