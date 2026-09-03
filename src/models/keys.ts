/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { Column } from "./column.js";
import { Key } from "./key.js";
import { CodeListParserError } from "./../code-list-parser-error.js";
import type { CodeListDocument } from "./../code-list-document.js";

/**
 * Keys of a code list.
 */
export class Keys implements Iterable<Key> {
    /**
     * The key instances.
     */
    private readonly keys: Key[] = [];

    /**
     * Creates a new instance of the Keys class.
     *
     * @returns The new instance.
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
     *
     * @param index - The index value.
     * @returns The key instance.
     */
    getAt(index: number): Key {
        return this.keys[index]!;
    }

    /**
     * Sets a key by index.
     *
     * @param index - The index value.
     * @param key - The key instance.
     * @returns No return value.
     */
    setAt(index: number, key: Key): void {
        this.keys[index] = key;
    }

    /**
     * Gets a key by ID.
     *
     * @param keyId - The keyId value.
     * @returns The key instance.
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
     *
     * @param keyId - The keyId value.
     * @param key - The key instance.
     * @returns No return value.
     */
    setById(keyId: string, key: Key): void {
        const index = this.findIndex((x) => x.id === keyId);

        if (index === -1) {
            throw new Error(`Key with ID "${keyId}" not found`);
        }

        this.keys[index] = key;
    }

    /**
     * Creates a new and empty key and adds it to the internal key collection.
     *
     * @returns The key instance.
     */
    add(): Key {
        const key = new Key(this.document);
        this.keys.push(key);
        return key;
    }

    /**
     * Removes all keys from the internal key collection.
     *
     * @returns No return value.
     */
    clear(): void {
        this.keys.length = 0;
    }

    /**
     * Does a certain key exist?
     *
     * @param predicate - The predicate value.
     * @returns True if any key matches the predicate; otherwise, false.
     */
    some(predicate: (key: Key) => boolean): boolean {
        return this.keys.some(predicate);
    }

    /**
     * Finds a certain key.
     *
     * @param predicate - The predicate value.
     * @returns The key instance if found; otherwise, null.
     */
    findOrDefault(predicate: (key: Key) => boolean): Key | null {
        return this.keys.find(predicate) ?? null;
    }

    /**
     * Index of a key.
     *
     * @param predicate - The predicate value.
     * @returns The index of the key if found; otherwise, -1.
     */
    findIndex(predicate: (key: Key) => boolean): number {
        return this.keys.findIndex(predicate);
    }

    /**
     * Removes a key.
     *
     * @param key - The key instance.
     * @returns True if the key was removed; otherwise, false.
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
     *
     * @param column - The column instance.
     * @returns The number of removed keys.
     */
    removeAll(column: Column): number {
        const originalLength = this.keys.length;

        for (let i = this.keys.length - 1; i >= 0; i--) {
            if (this.keys[i]!.columns.some((x) => x === column)) {
                this.keys.splice(i, 1);
            }
        }

        return originalLength - this.keys.length;
    }

    /**
     * Parses a JSON array into new Key instances
     *
     * @param json - The json value.
     * @returns No return value.
     */
    parseAndAdd(json: unknown[]): void {
        for (const item of json) {
            if (item != null && typeof item === "object" && !Array.isArray(item)) {
                this.keys.push(Key.parse(item as Record<string, unknown>, this.document));
                continue;
            }
            throw new CodeListParserError("Key definition must be an object.");
        }
    }

    /**
     * Allows iteration over the keys in the internal key collection.
     * 
     * @returns An iterator over the keys.
     */
    [Symbol.iterator](): Iterator<Key> {
        return this.keys[Symbol.iterator]();
    }
}
