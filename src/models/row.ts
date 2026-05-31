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

/**
 * The value of a row cell. 
 */
export type RowValue =
    | string
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
     */
    constructor(private readonly document: CodeListDocument) { }

    /**
     * Gets a value by column ID. 
     */
    get(columnId: string): RowValue {
        if (this.values.has(columnId)) {
            return this.values.get(columnId) ?? null;
        }

        if (this.document.columns.contains((x) => x.id === columnId)) {
            return null;
        }

        throw new CodeListParserError(`Column with ID "${columnId}" not found`);
    }

    /**
     * Sets a value by column ID. 
     */
    set(columnId: string, value: RowValue): void {
        const column = this.document.columns.tryFind((x) => x.id === columnId);

        if (column == null) {
            throw new CodeListParserError(`Column with ID "${columnId}" not found`);
        }

        this.assignValue(column, value);
    }

    /** 
     * Removes all values from the row. Note that the columns are not removed, so the row will still have the 
     * same number of columns after calling this method, but all values will be null or undefined.
     */
    clearValues(): void {
        this.values.clear();
    }

    /**
     * Removes the value of a column. 
     */
    removeValue(columnOrId: Column | string): boolean {
        const columnId = typeof columnOrId === "string"
            ? columnOrId
            : columnOrId.id;

        return this.values.delete(columnId);
    }

    /**
     * Parses a JSON object into a Row instance.
     */
    static parse(json: Record<string, unknown>, codeList: CodeListDocument): Row {
        const row = new Row(codeList);

        for (const [propertyName, value] of Object.entries(json)) {
            const column = row.document.columns.tryFind((x) => x.id === propertyName);

            if (column == null) {
                throw new CodeListParserError(
                    `Column with Id "${propertyName}" not found.`
                );
            }

            if (value !== null) {
                row.assignParsedValue(column, value);
            }
        }

        return row;
    }

    /**
     * Converts the row to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {};

        for (const column of this.document.columns) {
            if (this.values.has(column.id)) {
                const value = this.values.get(column.id) ?? null;
                json[column.id] = this.serializeValue(column, value);
            } else if (column.nullable === true) {
                json[column.id] = null;
            } else {
                throw new CodeListParserError("Null value is not allowed.");
            }
        }

        return json;
    }

    private assignParsedValue(column: Column, value: unknown): void {
        if (column instanceof StringColumn) {
            if (typeof value !== "string") {
                throw new CodeListParserError("Value is not a string.");
            }
            this.values.set(column.id, value);
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

    private assignValue(column: Column, value: RowValue): void {
        if (value === null) {
            if (column.nullable !== false) {
                this.values.set(column.id, null);
                return;
            }

            throw new Error("Value must not be NULL.");
        }

        this.assignParsedValue(column, value);
    }

    private serializeValue(column: Column, value: RowValue): unknown {
        if (value === null) {
            return null;
        }

        if (column instanceof StringColumn || column instanceof EnumColumn) {
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