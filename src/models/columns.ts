/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { BooleanColumn } from "./boolean-column.js";
import { CodeListParserError } from "./../code-list-parser-error.js";
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
import type { CodeListDocument } from "./../code-list-document.js";

/**
 * The column definitions of a code list.
 */
export class Columns implements Iterable<Column> {
    private readonly columns: Column[] = [];

    /**
     * Creates a new instance of the Columns class.
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
     */
    getAt(index: number): Column {
        return this.columns[index]!;
    }

    /**
     * Sets a column by index.
     */
    setAt(index: number, column: Column): void {
        this.columns[index] = column;
    }

    /**
     * Gets a column by ID.
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
     */
    setById(columnId: string, column: Column): void {
        const index = this.indexOf((x) => x.id === columnId);

        if (index === -1) {
            throw new Error(`Column with ID "${columnId}" not found`);
        }

        this.columns[index] = column;
    }

    /**
     * Adds a column to the internal column collection.
     */
    add<T extends Column>(column: T): T {
        this.columns.push(column);
        return column;
    }

    /**
     * Removes all columns from the internal column collection.
     */
    clear(): void {
        this.document.keys.clear();
        this.document.foreignKeys.clear();
        this.columns.length = 0;
        this.document.rows.clear();
    }

    /**
     * Does a certain column exist?
     */
    contains(predicate: (column: Column) => boolean): boolean {
        return this.columns.some(predicate);
    }

    /**
     * Finds a certain column.
     */
    findOrDefault(predicate: (column: Column) => boolean): Column | null {
        return this.columns.find(predicate) ?? null;
    }

    /**
     * Index of a certain column.
     */
    indexOf(predicate: (column: Column) => boolean): number {
        return this.columns.findIndex(predicate);
    }

    /**
     * Removes a column and all bound keys and foreign keys.
     * Also removes all values bound to this column.
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
     * Tries to find a column.
     */
    tryFind(predicate: (column: Column) => boolean): Column | null {
        return this.findOrDefault(predicate);
    }

    /**
     * Parses a JSON array into new Column instances
     * and adds them to the internal collection.
     */
    parseAndAdd(json: unknown[]): void {
        for (const item of json) {
            if (typeof item === "string") {
                const column = this.document.columns.tryFind((x) => x.id === item);

                if (column == null) {
                    throw new CodeListParserError(`Column Id "${item}" not found.`);
                }

                this.columns.push(column);
                continue;
            }

            if (item != null && typeof item === "object" && !Array.isArray(item)) {
                this.parseColumnDefinition(item as Record<string, unknown>);
            }
        }
    }

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

    [Symbol.iterator](): Iterator<Column> {
        return this.columns[Symbol.iterator]();
    }
}