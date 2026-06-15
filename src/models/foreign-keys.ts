/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { ForeignKey } from "./foreign-key.js";
import { Column } from "./column.js";
import { CodeListDocument } from "./../code-list-document.js";

/**
 * Foreign keys of a code list.
 */
export class ForeignKeys implements Iterable<ForeignKey> {
    private readonly foreignKeys: ForeignKey[] = [];

    /**
     * Creates a new instance of the ForeignKeys class.
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
     */
    getAt(index: number): ForeignKey {
        return this.foreignKeys[index]!;
    }

    /**
     * Sets a foreign key by index.
     */
    setAt(index: number, foreignKey: ForeignKey): void {
        this.foreignKeys[index] = foreignKey;
    }

    /**
     * Gets a foreign key by ID.
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
     */
    setById(foreignKeyId: string, foreignKey: ForeignKey): void {
        const index = this.indexOf((x) => x.id === foreignKeyId);

        if (index === -1) {
            throw new Error(
                `Foreign key with ID "${foreignKeyId}" not found`
            );
        }

        this.foreignKeys[index] = foreignKey;
    }

    /**
     * Creates a new and empty foreign key and adds it to the internal collection.
     */
    add(): ForeignKey {
        const foreignKey = new ForeignKey(this.document);
        this.foreignKeys.push(foreignKey);
        return foreignKey;
    }

    /**
     * Removes all foreign keys from the internal collection.
     */
    clear(): void {
        this.foreignKeys.length = 0;
    }

    /**
     * Does a certain foreign key exist?
     */
    contains(predicate: (foreignKey: ForeignKey) => boolean): boolean {
        return this.foreignKeys.some(predicate);
    }

    /**
     * Finds a certain foreign key.
     */
    findOrDefault(
        predicate: (foreignKey: ForeignKey) => boolean
    ): ForeignKey | null {
        return this.foreignKeys.find(predicate) ?? null;
    }

    /**
     * Index of a foreign key.
     */
    indexOf(predicate: (foreignKey: ForeignKey) => boolean): number {
        return this.foreignKeys.findIndex(predicate);
    }

    /**
     * Removes a foreign key.
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
     */
    removeAll(column: Column): number {
        const originalLength = this.foreignKeys.length;

        for (let i = this.foreignKeys.length - 1; i >= 0; i--) {
            if (this.foreignKeys[i]!.columns.contains((x) => x === column)) {
                this.foreignKeys.splice(i, 1);
            }
        }

        return originalLength - this.foreignKeys.length;
    }

    /**
     * Tries to find a certain foreign key.
     */
    tryFind(
        predicate: (foreignKey: ForeignKey) => boolean
    ): ForeignKey | null {
        return this.findOrDefault(predicate);
    }

    /**
     * Parses a JSON array into new ForeignKey instances
     * and adds them to the internal collection.
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
            }
        }
    }

    [Symbol.iterator](): Iterator<ForeignKey> {
        return this.foreignKeys[Symbol.iterator]();
    }
}