/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { ForeignKey } from "./foreign-key.js";
import { Column } from "./column.js";
import { CodeListDocument } from "./../code-list-document.js";
import { CodeListParserError } from "./../code-list-parser-error.js";

/**
 * Foreign keys of a code list.
 */
export class ForeignKeys implements Iterable<ForeignKey> {
    /**
     * The foreign key instances.
     */
    private readonly foreignKeys: ForeignKey[] = [];

    /**
     * Creates a new instance of the ForeignKeys class.
     *
     * @returns The new instance.
     */
    constructor(private readonly document: CodeListDocument) { }

    /**
     * Number of foreign keys.
     */
    get count(): number {
        return this.foreignKeys.length;
    }

    /**
     * Gets a foreign key by index.
     *
     * @param index - The index value.
     * @returns The operation result.
     */
    getAt(index: number): ForeignKey {
        return this.foreignKeys[index]!;
    }

    /**
     * Sets a foreign key by index.
     *
     * @param index - The index value.
     * @param foreignKey - The foreignKey instance.
     * @returns No return value.
     */
    setAt(index: number, foreignKey: ForeignKey): void {
        this.foreignKeys[index] = foreignKey;
    }

    /**
     * Gets a foreign key by ID.
     *
     * @param foreignKeyId - The foreignKeyId value.
     * @returns The operation result.
     */
    getById(foreignKeyId: string): ForeignKey {
        const foreignKey = this.findOrDefault(
            (x) => x.id === foreignKeyId
        );

        if (foreignKey == null) {
            throw new Error(
                `Foreign key with ID "${foreignKeyId}" not found`
            );
        }

        return foreignKey;
    }

    /**
     * Sets a foreign key by ID.
     *
     * @param foreignKeyId - The foreignKeyId value.
     * @param foreignKey - The foreignKey value.
     * @returns No return value.
     */
    setById(foreignKeyId: string, foreignKey: ForeignKey): void {
        const index = this.findIndex((x) => x.id === foreignKeyId);

        if (index === -1) {
            throw new Error(
                `Foreign key with ID "${foreignKeyId}" not found`
            );
        }

        this.foreignKeys[index] = foreignKey;
    }

    /**
     * Creates a new and empty foreign key and adds it to the internal collection.
     *
     * @returns The foreign key instance.
     */
    add(): ForeignKey {
        const foreignKey = new ForeignKey(this.document);
        this.foreignKeys.push(foreignKey);
        return foreignKey;
    }

    /**
     * Removes all foreign keys from the internal collection.
     *
     * @returns No return value.
     */
    clear(): void {
        this.foreignKeys.length = 0;
    }

    /**
     * Does a certain foreign key exist?
     *
     * @param predicate - The predicate value.
     * @returns True if any foreign key matches the predicate; otherwise, false.
     */
    some(predicate: (foreignKey: ForeignKey) => boolean): boolean {
        return this.foreignKeys.some(predicate);
    }

    /**
     * Finds a certain foreign key.
     *
     * @param predicate - The predicate value.
     * @returns The foreign key instance if found; otherwise, null.
     */
    findOrDefault(predicate: (foreignKey: ForeignKey) => boolean): ForeignKey | null {
        return this.foreignKeys.find(predicate) ?? null;
    }

    /**
     * Index of a foreign key.
     *
     * @param predicate - The predicate value.
     * @returns The index of the foreign key if found; otherwise, -1.
     */
    findIndex(predicate: (foreignKey: ForeignKey) => boolean): number {
        return this.foreignKeys.findIndex(predicate);
    }

    /**
     * Removes a foreign key.
     *
     * @param foreignKey - The foreignKey instance.
     * @returns True if the foreign key was removed; otherwise, false.
     */
    remove(foreignKey: ForeignKey): boolean {
        const index = this.foreignKeys.indexOf(foreignKey);

        if (index === -1) {
            return false;
        }

        this.foreignKeys.splice(index, 1);
        return true;
    }

    /**
     * Removes all foreign keys with reference to a given column.
     *
     * @param column - The column instance.
     * @returns The number of removed foreign keys.
     */
    removeAll(column: Column): number {
        const originalLength = this.foreignKeys.length;

        for (let i = this.foreignKeys.length - 1; i >= 0; i--) {
            if (this.foreignKeys[i]!.columns.some((x) => x === column)) {
                this.foreignKeys.splice(i, 1);
            }
        }

        return originalLength - this.foreignKeys.length;
    }

    /**
     * Parses a JSON array into new ForeignKey instances
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
                this.foreignKeys.push(
                    ForeignKey.parse(
                        item as Record<string, unknown>,
                        this.document
                    )
                );
                continue;
            }
            throw new CodeListParserError("Foreign key definition must be an object.");
        }
    }

    /**
     * Allows iteration over the foreign keys in the internal foreign key collection.
     * 
     * @returns An iterator over the foreign keys.
     */
    [Symbol.iterator](): Iterator<ForeignKey> {
        return this.foreignKeys[Symbol.iterator]();
    }
}
