/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { CodeListParserError } from "../code-list-parser-error.js";
import type { LocalizableString } from "../models/localizable-string.js";

/**
 * Utility class for JSON operations.
 */
export class JsonUtils {

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
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

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getRequiredString(json: Record<string, unknown>, propertyName: string): string {

        const value = JsonUtils.getString(json, propertyName);

        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }


    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getLanguageTag(json: Record<string, unknown>, propertyName: string): string | undefined {
        const value = JsonUtils.getString(json, propertyName);
        if (value === undefined) {
            return undefined;
        }

        return value;
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getRequiredLanguageTag(json: Record<string, unknown>, propertyName: string): string {
        const value = JsonUtils.getLanguageTag(json, propertyName);
        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getLocalizableString(json: Record<string, unknown>, propertyName: string): LocalizableString | undefined {
        const value = json[propertyName];
        if (value === undefined) {
            return undefined;
        }

        return JsonUtils.asLocalizableString(value, `Property '${propertyName}'`);
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getRequiredLocalizableString(json: Record<string, unknown>, propertyName: string): LocalizableString {
        const value = JsonUtils.getLocalizableString(json, propertyName);
        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param value - The value value.
     * @returns The operation result.
     */
    static asLocalizableString(value: unknown, context = "Value"): LocalizableString {
        if (typeof value === "string") {
            return value;
        }

        if (value == null || typeof value !== "object" || Array.isArray(value)) {
            throw new CodeListParserError(
                `${context} must be a string or an object containing localized strings.`
            );
        }

        const entries = Object.entries(value);
        if (entries.length === 0) {
            throw new CodeListParserError(
                `${context} must contain at least one localized string.`
            );
        }

        for (const [language, text] of entries) {
            if (typeof text !== "string") {
                throw new CodeListParserError(
                    `${context} contains a localized value that is not a string.`
                );
            }
        }

        return { ...(value as Record<string, string>) };
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
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

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getRequiredBoolean(json: Record<string, unknown>, propertyName: string): boolean {

        const value = JsonUtils.getBoolean(json, propertyName);

        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
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

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getRequiredInteger(json: Record<string, unknown>, propertyName: string): number {

        const value = JsonUtils.getInteger(json, propertyName);

        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getNumber(json: Record<string, unknown>, propertyName: string): number | undefined {

        const value = json[propertyName];

        if (value === undefined) {
            return undefined;
        }

        if (typeof value === "number" && Number.isFinite(value)) {
            return value;
        }

        throw new CodeListParserError(
            `Property '${propertyName}' must be a number.`
        );
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getRequiredNumber(json: Record<string, unknown>, propertyName: string): number {

        const value = JsonUtils.getNumber(json, propertyName);

        if (value !== undefined) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getObject(json: Record<string, unknown>, propertyName: string): Record<string, unknown> | undefined {

        const value = json[propertyName];

        if (value === undefined) {
            return undefined;
        }

        if (value != null && typeof value === "object" && !Array.isArray(value)) {
            return value as Record<string, unknown>;
        }

        throw new CodeListParserError(
            `Property '${propertyName}' must be an object.`
        );
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
    static getRequiredObject(json: Record<string, unknown>, propertyName: string): Record<string, unknown> {

        const value = JsonUtils.getObject(json, propertyName);

        if (value != null) {
            return value;
        }

        throw new CodeListParserError(
            `Missing required property '${propertyName}'.`
        );
    }

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
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

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
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

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
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

    /**
     * Executes the operation and returns a result.
     *
     * @param json - The json value.
     * @param propertyName - The propertyName value.
     * @returns The operation result.
     */
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