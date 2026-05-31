import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { Column } from "./column.js";

/**
 * This is a boolean type column.
 */
export class BooleanColumn extends Column {

    /**
     * Parses a JSON object into a BooleanColumn instance.
     */
    static parse(json: Record<string, unknown>): BooleanColumn {
        const column = new BooleanColumn();

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

        return column;
    }

    /**
     * Converts this instance to a JSON object.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.Boolean,
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

        return json;
    }
}