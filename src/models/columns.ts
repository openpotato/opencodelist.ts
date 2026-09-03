/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
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
import { CodeListDocument } from "./../code-list-document.js";


/**
 * The column definitions of a code list.
 */
export class Columns implements Iterable<Column> {
    /**
     * The column instances.
     */
    private readonly columns: Column[] = [];

    /**
     * Creates a new instance of the Columns class.
     *
     * @returns The new instance.
     */
    constructor(private readonly document: CodeListDocument) { }

    /**
     * Number of columns.
     */
    get count(): number {
        return this.columns.length;
    }

    /**
     * Gets a column by index.
     *
     * @param index - The index value.
     * @returns The operation result.
     */
    getAt(index: number): Column {
        return this.columns[index]!;
    }

    /**
     * Sets a column by index.
     *
     * @param index - The index value.
     * @param column - The column instance.
     * @returns No return value.
     */
    setAt(index: number, column: Column): void {
        this.columns[index] = column;
    }

    /**
     * Gets a column by ID.
     *
     * @param columnId - The columnId value.
     * @returns The operation result.
     */
    getById(columnId: string): Column {
        const column = this.findOrDefault((x) => x.id === columnId);

        if (column == null) {
            throw new Error(`Column with ID "${columnId}" not found`);
        }

        return column;
    }

    /**
     * Sets a column by ID.
     *
     * @param columnId - The columnId value.
     * @param column - The column instance.
     * @returns No return value.
     */
    setById(columnId: string, column: Column): void {
        const index = this.findIndex((x) => x.id === columnId);

        if (index === -1) {
            throw new Error(`Column with ID "${columnId}" not found`);
        }

        this.columns[index] = column;
    }

    /**
     * Adds a column to the internal column collection.
     *
     * @param column - The column instance.
     * @returns The column instance.
     */
    add<T extends Column>(column: T): T {
        this.columns.push(column);
        return column;
    }

    /**
     * Removes all columns from the internal column collection.
     *
     * @returns No return value.
     */
    clear(): void {
        this.document.keys.clear();
        this.document.foreignKeys.clear();
        this.columns.length = 0;
        this.document.rows.clear();
    }

    /**
     * Finds a certain column.
     *
     * @param predicate - The predicate value.
     * @returns The operation result.
     */
    findOrDefault(predicate: (column: Column) => boolean): Column | null {
        return this.columns.find(predicate) ?? null;
    }

    /**
     * Index of a certain column.
     *
     * @param predicate - The predicate value.
     * @returns The operation result.
     */
    findIndex(predicate: (column: Column) => boolean): number {
        return this.columns.findIndex(predicate);
    }

    /**
     * Removes a column and all bound keys and foreign keys. Also removes all values bound to this column.
     *
     * @param column - The column value.
     * @returns No return value.
     */
    remove(column: Column): void {
        if (this.document.rows.count !== 0) {
            throw new Error("Removing columns from a filled code list is not allowed.");
        }

        const index = this.columns.indexOf(column);
        if (index !== -1) {
            this.columns.splice(index, 1);
            this.document.keys.removeAll(column);
            this.document.foreignKeys.removeAll(column);
            this.document.rows.removeValues(column);
        }
    }

    /**
     * Does any column match the given predicate?
     *
     * @param predicate - The predicate value.
     * @returns The operation result.
     */
    some(predicate: (column: Column) => boolean): boolean {
        return this.columns.some(predicate);
    }

    /**
     * Parses a JSON array into new Column instances and adds them to the internal collection.
     *
     * @param json - The json value.
     * @returns No return value.
     */
    parseAndAdd(json: unknown[]): void {
        for (const item of json) {
            if (typeof item === "string") {
                const column = this.document.columns.findOrDefault((x) => x.id === item);

                if (column == null) {
                    throw new CodeListParserError(`Column Id "${item}" not found.`);
                }

                this.columns.push(column);
                continue;
            }

            if (item != null && typeof item === "object" && !Array.isArray(item)) {
                this.parseColumnDefinition(item as Record<string, unknown>);
                continue;
            }

            throw new CodeListParserError("Column definition must be an object or a column ID string.");
        }
    }

    /**
     * Parses a column definition from a JSON object and adds it to the internal collection.
     *
     * @param json - The json value.
     * @returns No return value.
     */
    private parseColumnDefinition(json: Record<string, unknown>): void {
        const type = json[PropertyNames.Type];

        if (typeof type !== "string") {
            throw new CodeListParserError("Type column is missing.");
        }

        switch (type) {
            case TypeConsts.String:
                this.columns.push(StringColumn.parse(json));
                break;
            
            case TypeConsts.Number:
                this.columns.push(NumberColumn.parse(json));
                break;

            case TypeConsts.Integer:
                this.columns.push(IntegerColumn.parse(json));
                break;

            case TypeConsts.Boolean:
                this.columns.push(BooleanColumn.parse(json));
                break;

            case TypeConsts.DateOnly:
                this.columns.push(DateOnlyColumn.parse(json));
                break;

            case TypeConsts.DateTime:
                this.columns.push(DateTimeColumn.parse(json));
                break;

            case TypeConsts.TimeOnly:
                this.columns.push(TimeOnlyColumn.parse(json));
                break;

            case TypeConsts.Enum:
                this.columns.push(EnumColumn.parse(json));
                break;

            case TypeConsts.EnumSet:
                this.columns.push(EnumSetColumn.parse(json));
                break;

            case TypeConsts.Document:
                this.columns.push(JsonColumn.parse(json));
                break;

            default:
                throw new CodeListParserError(`Unknown column type "${type}".`);
        }
    }

    /**
     * Allows iteration over the columns in the internal column collection.
     * 
     * @returns An iterator over the columns.
     */
    [Symbol.iterator](): Iterator<Column> {
        return this.columns[Symbol.iterator]();
    }
}