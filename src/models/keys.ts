/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { Column } from "./column.js";
import { Key } from "./key.js";
import type { CodeListDocument } from "./../code-list-document.js";

/**
 * Keys of a code list.
 */
export class Keys implements Iterable<Key> {
    private readonly keys: Key[] = [];

    /**
     * Creates a new instance of the Keys class.
     */
    constructor(private readonly document: CodeListDocument) { }

    /**
     * Number of keys.
     */
    get count(): number {
        return this.keys.length;
    }

    /**
     * Gets a key by index.
     */
    getAt(index: number): Key {
        return this.keys[index]!;
    }

    /**
     * Sets a key by index.
     */
    setAt(index: number, key: Key): void {
        this.keys[index] = key;
    }

    /**
     * Gets a key by ID.
     */
    getById(keyId: string): Key {
        const key = this.findOrDefault((x) => x.id === keyId);

        if (key == null) {
            throw new Error(`Key with ID "${keyId}" not found`);
        }

        return key;
    }

    /**
     * Sets a key by ID.
     */
    setById(keyId: string, key: Key): void {
        const index = this.indexOf((x) => x.id === keyId);

        if (index === -1) {
            throw new Error(`Key with ID "${keyId}" not found`);
        }

        this.keys[index] = key;
    }

    /**
     * Creates a new and empty key and adds it to the internal key collection.
     */
    add(): Key {
        const key = new Key(this.document);
        this.keys.push(key);
        return key;
    }

    /**
     * Removes all keys from the internal key collection.
     */
    clear(): void {
        this.keys.length = 0;
    }

    /**
     * Does a certain key exist?
     */
    contains(predicate: (key: Key) => boolean): boolean {
        return this.keys.some(predicate);
    }

    /**
     * Finds a certain key.
     */
    findOrDefault(predicate: (key: Key) => boolean): Key | null {
        return this.keys.find(predicate) ?? null;
    }

    /**
     * Index of a key.
     */
    indexOf(predicate: (key: Key) => boolean): number {
        return this.keys.findIndex(predicate);
    }

    /**
     * Removes a key.
     */
    remove(key: Key): boolean {
        const index = this.keys.indexOf(key);

        if (index === -1) {
            return false;
        }

        this.keys.splice(index, 1);
        return true;
    }

    /**
     * Removes all keys with reference to a given column.
     */
    removeAll(column: Column): number {
        const originalLength = this.keys.length;

        for (let i = this.keys.length - 1; i >= 0; i--) {
            if (this.keys[i]!.columns.contains((x) => x === column)) {
                this.keys.splice(i, 1);
            }
        }

        return originalLength - this.keys.length;
    }

    /**
     * Tries to find a certain key.
     */
    tryFind(predicate: (key: Key) => boolean): Key | null {
        return this.findOrDefault(predicate);
    }

    /**
     * Parses a JSON array into new Key instances
     * and adds them to the internal collection.
     */
    parseAndAdd(json: unknown[]): void {
        for (const item of json) {
            if (item != null && typeof item === "object" && !Array.isArray(item)) {
                this.keys.push(Key.parse(item as Record<string, unknown>, this.document));
            }
        }
    }

    [Symbol.iterator](): Iterator<Key> {
        return this.keys[Symbol.iterator]();
    }
}