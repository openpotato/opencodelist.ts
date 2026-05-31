import { Column } from "./column.js";
import { Row } from "./row.js";
import type { CodeListDocument } from "./../code-list-document.js";

/**
 * The data rows of a code list.
 */
export class Rows implements Iterable<Row> {
    private readonly rows: Row[] = [];

    /**
     * Creates a new instance of the Rows class.
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
     */
    getAt(index: number): Row {
        return this.rows[index]!;
    }

    /**
     * Creates a new and empty row and adds it to the internal row collection.
     */
    add(): Row {
        const row = new Row(this.document);
        this.addRow(row);
        return row;
    }

    /**
     * Removes all rows from the internal row collection.
     */
    clear(): void {
        this.rows.length = 0;
    }

    /**
     * Removes all values with reference to a given column.
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
     */
    addRow(row: Row): void {
        this.rows.push(row);
        this.document.metaOnly = false;
    }

    /**
     * Parses a JSON array into new Row instances
     * and adds them to the internal collection.
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
            }
        }
    }

    [Symbol.iterator](): Iterator<Row> {
        return this.rows[Symbol.iterator]();
    }
}