/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./dictionaries/property-names.js";
import { JsonUtils } from "./utils/json-utils.js";
import { Annotation } from "./models/annotation.js";
import { Columns } from "./models/columns.js";
import { ForeignKeys } from "./models/foreign-keys.js";
import { Identification } from "./models/identification.js";
import { Key } from "./models/key.js";
import { Keys } from "./models/keys.js";
import { Rows } from "./models/rows.js";
import { CodeListBase } from "./code-list-base.js";
import { CodeListParserError } from "./code-list-parser-error.js";

/**
 * A code list document according to the OpenCodeList specification.
 */
export class CodeListDocument extends CodeListBase {

    /**
     * Creates a new instance of the CodeListDocument class.
     *
     * @returns The new instance.
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
     *
     * @param root - The root value.
     * @returns The parsed instance.
     */
    static parse(root: Record<string, unknown>): CodeListDocument {
        const openCodeListVersion = JsonUtils.getRequiredString(root, PropertyNames.OpenCodeList);
        
        if (!CodeListBase.supportedVersionRange.test(openCodeListVersion)) {
            throw new CodeListParserError(
                `Unsupported OpenCodeList version '${openCodeListVersion}'.`
            );
        }        

        if (root[PropertyNames.CodeListSet] !== undefined) {
            throw new CodeListParserError(`OpenCodeList document must contain exactly one of "${PropertyNames.CodeList}" or "${PropertyNames.CodeListSet}".`);
        }

        const codeList = root[PropertyNames.CodeList];

        if (codeList == null || typeof codeList !== "object" || Array.isArray(codeList)) {
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
     *
     * @param root - The root value.
     * @param codeList - The codeList value.
     * @returns The operation result.
     */
    static parseContent(
        root: Record<string, unknown>,
        codeList: Record<string, unknown>
    ): CodeListDocument {
        const document = new CodeListDocument();

        const comments = JsonUtils.getStringArray(root, PropertyNames.Comments);
        if (comments !== undefined) {
            document.comments.push(...comments);
        }

        const annotation = JsonUtils.getObject(codeList, PropertyNames.Annotation);
        if (annotation !== undefined) {
            document.annotation = Annotation.parse(annotation);
        }

        document.identification = Identification.parse(
            JsonUtils.getRequiredObject(codeList, PropertyNames.Identification)
        );

        const columnSet = JsonUtils.getRequiredObject(codeList, PropertyNames.ColumnSet);
        document.columns.parseAndAdd(
            JsonUtils.getRequiredArray(columnSet, PropertyNames.Columns)
        );
        document.keys.parseAndAdd(
            JsonUtils.getRequiredArray(columnSet, PropertyNames.Keys)
        );

        const defaultKey = JsonUtils.getObject(columnSet, PropertyNames.DefaultKey);
        if (defaultKey !== undefined) {
            const keyId = JsonUtils.getRequiredString(defaultKey, PropertyNames.KeyId);
            const key = document.keys.findOrDefault((x) => x.id === keyId);
            if (key == null) {
                throw new CodeListParserError(`Key Id "${keyId}" not found.`);
            }
            document.defaultKey = key;
        }

        const foreignKeys = JsonUtils.getArray(columnSet, PropertyNames.ForeignKeys);
        if (foreignKeys !== undefined) {
            document.foreignKeys.parseAndAdd(foreignKeys);
        }

        const dataSet = JsonUtils.getObject(codeList, PropertyNames.DataSet);
        if (dataSet !== undefined) {
            document.metaOnly = false;
            document.rows.parseAndAdd(
                JsonUtils.getRequiredArray(dataSet, PropertyNames.Rows)
            );
        }

        return document;
    }

    /**
     * Clears the metadata and content of this document instance.
     *
     * @returns No return value.
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
     *
     * @param convertToMetaOnly - The convertToMetaOnly value.
     * @returns No return value.
     */
    override clearContent(convertToMetaOnly: boolean): void {
        this.rows.clear();
        super.clearContent(convertToMetaOnly);
    }

    /**
     * Converts the document to JSON.
     *
     * @returns The JSON representation.
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
            [PropertyNames.OpenCodeList]: CodeListBase.implementedVersion.toString(),
            [PropertyNames.CodeList]: codeList,
        };

        if (this.comments.length > 0) {
            root[PropertyNames.Comments] = [...this.comments];
        }

        return root;
    }
}