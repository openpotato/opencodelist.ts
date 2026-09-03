/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { BooleanColumn } from "./boolean-column.js";
import { Column } from "./column.js";
import { DateOnlyColumn } from "./date-only-column.js";
import { DateTimeColumn } from "./date-time-column.js";
import { EnumColumn } from "./enum-column.js";
import { EnumSetColumn } from "./enum-set-column.js";
import { IntegerColumn } from "./integer-column.js";
import { JsonColumn } from "./json-column.js";
import { NumberColumn } from "./number-column.js";
import { StringColumn } from "./string-column.js";
import { TimeOnlyColumn } from "./time-only-column.js";
import { CodeListParserError } from "./../code-list-parser-error.js";
import type { CodeListDocument } from "./../code-list-document.js";
import type { LocalizableString } from "./localizable-string.js";
import { JsonUtils } from "./../utils/json-utils.js";

/**
 * The value of a row cell. 
 */
export type RowValue =
    | LocalizableString
    | number
    | boolean
    | string[]
    | Record<string, unknown>
    | unknown[]
    | null;

/**
 * A data row of a code list.
 */
export class Row implements Iterable<[string, RowValue]> {
    private readonly values = new Map<string, RowValue>();

    /**
     * Creates a new instance of the Row class.
     *
     * @returns The new instance.
     */
    constructor(private readonly document: CodeListDocument) { }

    /**
     * Gets a value by column ID.
     *
     * @param columnId - The columnId value.
     * @returns The operation result.
     */
    get(columnId: string): RowValue {
        if (this.values.has(columnId)) {
            return this.values.get(columnId) ?? null;
        }

        if (this.document.columns.some((x) => x.id === columnId)) {
            return null;
        }

        throw new CodeListParserError(`Column with ID "${columnId}" not found`);
    }

    /**
     * Sets a value by column ID.
     *
     * @param columnId - The columnId value.
     * @param value - The value value.
     * @returns No return value.
     */
    set(columnId: string, value: RowValue): void {
        const column = this.document.columns.findOrDefault((x) => x.id === columnId);

        if (column == null) {
            throw new CodeListParserError(`Column with ID "${columnId}" not found`);
        }

        this.assignValue(column, value);
    }

    /**
     * Removes all values from the row. Note that the columns are not removed, so the row will still have the
     *
     * @returns No return value.
     */
    clearValues(): void {
        this.values.clear();
    }

    /**
     * Removes the value of a column.
     *
     * @param columnOrId - The columnOrId value.
     * @returns The operation result.
     */
    removeValue(columnOrId: Column | string): boolean {
        const columnId = typeof columnOrId === "string"
            ? columnOrId
            : columnOrId.id;

        return this.values.delete(columnId);
    }

    /**
     * Parses a JSON object into a Row instance.
     *
     * @param json - The JSON object instance.
     * @param codeList - The CodeListDocument instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>, codeList: CodeListDocument): Row {
        const row = new Row(codeList);

        for (const [propertyName, value] of Object.entries(json)) {
            const column = row.document.columns.findOrDefault((x) => x.id === propertyName);

            if (column == null) {
                throw new CodeListParserError(
                    `Column with Id "${propertyName}" not found.`
                );
            }

            if (value === null) {
                row.values.set(column.id, null);
            } else {
                row.assignParsedValue(column, value);
            }
        }

        return row;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {};

        for (const column of this.document.columns) {
            if (this.values.has(column.id)) {
                const value = this.values.get(column.id) ?? null;
                json[column.id] = this.serializeValue(column, value);
            } else if (column.optional === true) {
                continue;
            } else if (column.nullable === true) {
                json[column.id] = null;
            } else {
                throw new CodeListParserError("Null value is not allowed.");
            }
        }

        return json;
    }

    /**
     * Executes the operation.
     *
     * @param column - The column value.
     * @param value - The value value.
     * @returns No return value.
     */
    private assignParsedValue(column: Column, value: unknown): void {
        if (column instanceof StringColumn) {
            this.values.set(
                column.id,
                JsonUtils.asLocalizableString(value, `Value for column '${column.id}'`)
            );
        } else if (column instanceof BooleanColumn) {
            if (typeof value !== "boolean") {
                throw new CodeListParserError("Value is not a boolean.");
            }
            this.values.set(column.id, value);
        } else if (column instanceof IntegerColumn) {
            if (typeof value !== "number" || !Number.isInteger(value)) {
                throw new CodeListParserError("Value is not an integer.");
            }
            this.values.set(column.id, value);
        } else if (column instanceof NumberColumn) {
            if (typeof value !== "number") {
                throw new CodeListParserError("Value is not a number.");
            }
            this.values.set(column.id, value);
        } else if (
            column instanceof DateTimeColumn ||
            column instanceof DateOnlyColumn ||
            column instanceof TimeOnlyColumn ||
            column instanceof EnumColumn
        ) {
            if (typeof value !== "string") {
                throw new CodeListParserError("Value is not a string.");
            }
            this.values.set(column.id, value);
        } else if (column instanceof EnumSetColumn) {
            if (!Array.isArray(value) || !value.every((x) => typeof x === "string")) {
                throw new CodeListParserError("Value is not an enum-set.");
            }
            this.values.set(column.id, value);
        } else if (column instanceof JsonColumn) {
            if (value == null || typeof value !== "object") {
                throw new CodeListParserError("Value is not an object or an array.");
            }
            this.values.set(column.id, value as Record<string, unknown> | unknown[]);
        }
    }

    /**
     * Executes the operation.
     *
     * @param column - The column value.
     * @param value - The value value.
     * @returns No return value.
     */
    private assignValue(column: Column, value: RowValue): void {
        if (value === null) {
            if (column.nullable === true) {
                this.values.set(column.id, null);
                return;
            }

            throw new CodeListParserError("Value must not be NULL.");
        }

        this.assignParsedValue(column, value);
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param column - The column value.
     * @param value - The value value.
     * @returns The operation result.
     */
    private serializeValue(column: Column, value: RowValue): unknown {
        if (value === null) {
            return null;
        }

        if (column instanceof StringColumn) {
            return JsonUtils.asLocalizableString(
                value,
                `Value for column '${column.id}'`
            );
        }

        if (column instanceof EnumColumn) {
            if (typeof value !== "string") {
                throw new CodeListParserError("Value is not a string.");
            }
            return value;
        }

        if (column instanceof BooleanColumn) {
            if (typeof value !== "boolean") {
                throw new CodeListParserError("Value is not a bool.");
            }
            return value;
        }

        if (column instanceof IntegerColumn) {
            if (typeof value !== "number" || !Number.isInteger(value)) {
                throw new CodeListParserError("Value is not an int.");
            }
            return value;
        }

        if (column instanceof NumberColumn) {
            if (typeof value !== "number") {
                throw new CodeListParserError("Value is not a number.");
            }
            return value;
        }

        if (
            column instanceof DateTimeColumn ||
            column instanceof DateOnlyColumn ||
            column instanceof TimeOnlyColumn
        ) {
            if (typeof value !== "string") {
                throw new CodeListParserError("Value is not a date/time string.");
            }
            return value;
        }

        if (column instanceof EnumSetColumn) {
            if (!Array.isArray(value) || !value.every((x) => typeof x === "string")) {
                throw new CodeListParserError("Value is not a string array.");
            }
            return value;
        }

        if (column instanceof JsonColumn) {
            if (typeof value !== "object") {
                throw new CodeListParserError(
                    "Value is neither a JSON object nor a JSON array."
                );
            }
            return value;
        }

        return value;
    }

    [Symbol.iterator](): Iterator<[string, RowValue]> {
        return this.values[Symbol.iterator]();
    }
}