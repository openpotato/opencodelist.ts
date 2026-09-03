/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { Column } from "./column.js";
import { Row } from "./row.js";
import { CodeListParserError } from "./../code-list-parser-error.js";
import type { CodeListDocument } from "./../code-list-document.js";

/**
 * The data rows of a code list.
 */
export class Rows implements Iterable<Row> {
    /**
     * The rows value.
     */
    private readonly rows: Row[] = [];

    /**
     * Creates a new instance of the Rows class.
     *
     * @returns The new instance.
     */
    constructor(private readonly document: CodeListDocument) { }

    /**
     * Number of rows.
     */
    get count(): number {
        return this.rows.length;
    }

    /**
     * Gets a row by index.
     *
     * @param index - The index value.
     * @returns The operation result.
     */
    getAt(index: number): Row {
        return this.rows[index]!;
    }

    /**
     * Creates a new and empty row and adds it to the internal row collection.
     *
     * @returns The operation result.
     */
    add(): Row {
        const row = new Row(this.document);
        this.addRow(row);
        return row;
    }

    /**
     * Removes all rows from the internal row collection.
     *
     * @returns No return value.
     */
    clear(): void {
        this.rows.length = 0;
    }

    /**
     * Removes all values with reference to a given column.
     *
     * @param columnOrId - The columnOrId value.
     * @returns No return value.
     */
    removeValues(columnOrId: Column | string): void {
        const columnId =
            typeof columnOrId === "string"
                ? columnOrId
                : columnOrId.id;

        for (const row of this.rows) {
            row.removeValue(columnId);
        }
    }

    /**
     * Adds a new row to the internal row collection.
     *
     * @param row - The row value.
     * @returns No return value.
     */
    addRow(row: Row): void {
        this.rows.push(row);
        this.document.metaOnly = false;
    }

    /**
     * Parses a JSON array into new Row instances
     *
     * @param json - The json value.
     * @returns No return value.
     */
    parseAndAdd(json: unknown[]): void {
        for (const item of json) {
            if (
                item != null &&
                typeof item === "object" &&
                !Array.isArray(item)
            ) {
                this.addRow(
                    Row.parse(item as Record<string, unknown>, this.document)
                );
                continue;
            }
            throw new CodeListParserError("Row must be an object.");
        }
    }

    /**
     * Allows iteration over the rows in the internal row collection.
     * 
     * @returns An iterator over the rows.
     */
    [Symbol.iterator](): Iterator<Row> {
        return this.rows[Symbol.iterator]();
    }
}
