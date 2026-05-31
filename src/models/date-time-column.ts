import { Column } from "./column.js";
import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";

/**
 * This is a date-time type column. The serialized format must match the native JSON string
 * with the JSON Schema format `date-time`.
 *
 * See: https://json-schema.org/understanding-json-schema/reference/string
 */
export class DateTimeColumn extends Column {

    /**
     * A value that specifies the maximum allowed value.
     */
    public maxValue: string | null = null;

    /**
     * A value that specifies the minimum allowed value.
     */
    public minValue: string | null = null;

    /**
     * Parses a JSON object into a DateTimeColumn instance.
     */
    static parse(json: Record<string, unknown>): DateTimeColumn {
        const column = new DateTimeColumn();

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
        if (typeof minValue === "string") {
            column.minValue = minValue;
        }

        const maxValue = json[PropertyNames.MaxValue];
        if (typeof maxValue === "string") {
            column.maxValue = maxValue;
        }

        return column;
    }

    /**
     * Converts this instance to a JSON object.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.DateTime,
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

        return json;
    }
}