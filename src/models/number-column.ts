import { Column } from "./column.js";
import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";

/**
 * This is a float type column.
 */
export class NumberColumn extends Column {

    /**
     * A number value representing an exclusive upper limit for a value.
     */
    public exclusiveMaxValue: number | null = null;

    /**
     * A number value representing an exclusive lower limit for a value.
     */
    public exclusiveMinValue: number | null = null;

    /**
     * A number value that specifies the maximum allowed value.
     */
    public maxValue: number | null = null;

    /**
     * A number value that specifies the minimum allowed value.
     */
    public minValue: number | null = null;

    /**
     * Parses a JSON object into a NumberColumn instance.
     */
    static parse(json: Record<string, unknown>): NumberColumn {
        const column = new NumberColumn();

        const id = json[PropertyNames.Id];
        if (typeof id !== "string") {
            throw new Error(`Missing required property '${PropertyNames.Id}'.`);
        }
        column.id = id;

        const name = json[PropertyNames.Name];
        if (typeof name !== "string") {
            throw new Error(`Missing required property '${PropertyNames.Name}'.`);
        }
        column.name = name;

        const description = json[PropertyNames.Description];
        if (typeof description === "string") {
            column.description = description;
        }

        const nullable = json[PropertyNames.Nullable];
        if (typeof nullable === "boolean") {
            column.nullable = nullable;
        }

        const optional = json[PropertyNames.Optional];
        if (typeof optional === "boolean") {
            column.optional = optional;
        }

        const minValue = json[PropertyNames.MinValue];
        if (typeof minValue === "number") {
            column.minValue = minValue;
        }

        const maxValue = json[PropertyNames.MaxValue];
        if (typeof maxValue === "number") {
            column.maxValue = maxValue;
        }

        const exclusiveMinValue = json[PropertyNames.ExclusiveMinValue];
        if (typeof exclusiveMinValue === "number") {
            column.exclusiveMinValue = exclusiveMinValue;
        }

        const exclusiveMaxValue = json[PropertyNames.ExclusiveMaxValue];
        if (typeof exclusiveMaxValue === "number") {
            column.exclusiveMaxValue = exclusiveMaxValue;
        }

        return column;
    }

    /**
     * Converts this instance to a JSON object.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.Number,
            [PropertyNames.Id]: this.id,
            [PropertyNames.Name]: this.name,
        };

        if (this.description != null) {
            json[PropertyNames.Description] = this.description;
        }

        if (this.nullable != null) {
            json[PropertyNames.Nullable] = this.nullable;
        }

        if (this.optional != null) {
            json[PropertyNames.Optional] = this.optional;
        }

        if (this.minValue != null) {
            json[PropertyNames.MinValue] = this.minValue;
        }

        if (this.maxValue != null) {
            json[PropertyNames.MaxValue] = this.maxValue;
        }

        if (this.exclusiveMinValue != null) {
            json[PropertyNames.ExclusiveMinValue] = this.exclusiveMinValue;
        }

        if (this.exclusiveMaxValue != null) {
            json[PropertyNames.ExclusiveMaxValue] = this.exclusiveMaxValue;
        }

        return json;
    }
}