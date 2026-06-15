/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { CodeListParserError } from "../code-list-parser-error.js";

/**
 * Utility class for JSON operations.
 */
export class JsonUtils {

    static getString(json: Record<string, unknown>, propertyName: string): string | undefined {

        const value = json[propertyName];

        if (value === undefined) {
            return undefined;
        }

        if (typeof value === "string") {
            return value;
        }

        throw new CodeListParserError(
            `Property '${propertyName}' must be a string.`
        );
    }

    static getRequiredString(json: Record<string, unknown>, propertyName: string): string {

        const value = JsonUtils.getString(json, propertyName);

        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    static getBoolean(json: Record<string, unknown>, propertyName: string): boolean | undefined {

        const value = json[propertyName];

        if (value === undefined) {
            return undefined;
        }

        if (typeof value === "boolean") {
            return value;
        }

        throw new CodeListParserError(
            `Property '${propertyName}' must be a boolean.`
        );
    }

    static getRequiredBoolean(json: Record<string, unknown>, propertyName: string): boolean {

        const value = JsonUtils.getBoolean(json, propertyName);

        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    static getInteger(json: Record<string, unknown>, propertyName: string): number | undefined {

        const value = json[propertyName];

        if (value === undefined) {
            return undefined;
        }

        if (typeof value === "number" && Number.isInteger(value)) {
            return value;
        }

        throw new CodeListParserError(
            `Property '${propertyName}' must be an integer.`
        );
    }

    static getRequiredInteger(json: Record<string, unknown>, propertyName: string): number {

        const value = JsonUtils.getInteger(json, propertyName);

        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    static getNumber(json: Record<string, unknown>, propertyName: string): number | undefined {

        const value = json[propertyName];

        if (value === undefined) {
            return undefined;
        }

        if (typeof value === "number") {
            return value;
        }

        throw new CodeListParserError(
            `Property '${propertyName}' must be a number.`
        );
    }

    static getRequiredNumber(json: Record<string, unknown>, propertyName: string): number {

        const value = JsonUtils.getNumber(json, propertyName);

        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    static getObject(json: Record<string, unknown>, propertyName: string): Record<string, unknown> | undefined {

        const value = json[propertyName];

        if (value != null && typeof value === "object" && !Array.isArray(value)) {
            return value as Record<string, unknown>;
        }

        return undefined;
    }

    static getRequiredObject(json: Record<string, unknown>, propertyName: string): Record<string, unknown> {

        const value = JsonUtils.getObject(json, propertyName);

        if (value != null) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    static getArray(json: Record<string, unknown>, propertyName: string): unknown[] | undefined {

        const value = json[propertyName];

        if (value === undefined) {
            return undefined;
        }

        if (!Array.isArray(value)) {
            throw new CodeListParserError(
                `Property '${propertyName}' must be an array.`
            );
        }

        return value;
    }

    static getRequiredArray(
        json: Record<string, unknown>,
        propertyName: string,
    ): unknown[] {

        const value = JsonUtils.getArray(json, propertyName);

        if (value != null) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    static getStringArray(json: Record<string, unknown>, propertyName: string): string[] | undefined {

        const value = JsonUtils.getArray(json, propertyName);

        if (value === undefined) {
            return undefined;
        }

        return value.map((item) => {
            if (typeof item !== "string") {
                throw new CodeListParserError(
                    `All items in '${propertyName}' must be strings.`
                );
            }

            return item;
        });
    }

    static getRequiredStringArray(json: Record<string, unknown>, propertyName: string): string[] {

        const value = JsonUtils.getStringArray(json, propertyName);

        if (value != null) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    static getObjectArray<T>(
        json: Record<string, unknown>,
        propertyName: string,
        parser: (item: Record<string, unknown>) => T | null | undefined,
    ): NonNullable<T>[] | undefined {

        const value = JsonUtils.getArray(json, propertyName);

        if (value == null) {
            return undefined;
        }

        return JsonUtils.parseObjectArray(value, propertyName, parser);
    }

    static getRequiredObjectArray<T>(
        json: Record<string, unknown>,
        propertyName: string,
        parser: (item: Record<string, unknown>) => T | null | undefined,
    ): NonNullable<T>[] {

        const value = JsonUtils.getObjectArray(json, propertyName, parser);

        if (value != null) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    private static parseObjectArray<T>(
        value: unknown[],
        propertyName: string,
        parser: (item: Record<string, unknown>) => T | null | undefined,
    ): NonNullable<T>[] {

        return value.map((item) => {
            if (item != null && typeof item === "object" && !Array.isArray(item)) {
                const parsedItem = parser(item as Record<string, unknown>);
                if (parsedItem == null) {
                    throw new Error(
                        `Parser result for items in '${propertyName}' must not be null or undefined.`
                    );
                }

                return parsedItem as NonNullable<T>;
            }

            throw new CodeListParserError(
                `All items in '${propertyName}' must be objects.`
            );
        });
    }
}