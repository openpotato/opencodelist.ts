import { Column } from "./column.js";
import { JsonColumnSchemaLocation } from "./json-column-schema-location.js";
import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { CodeListParserError } from "./../code-list-parser-error.js";

/**
 * This is a column representing an embedded JSON object or array.
 */
export class JsonColumn extends Column {

    /**
     * Embedded JSON schema.
     */
    public embeddedSchema: Record<string, unknown> | null = null;

    /**
     * URI to the JSON schema file.
     */
    public externalSchema: string | null = null;

    /**
     * Schema location.
     */
    public schemaLocation: JsonColumnSchemaLocation =
        JsonColumnSchemaLocation.External;

    /**
     * Parses a JSON object into a JsonColumn instance.
     */
    static parse(json: Record<string, unknown>): JsonColumn {
        const column = new JsonColumn();

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

        const schema = json[PropertyNames.Schema];
        if (typeof schema === "string") {
            column.schemaLocation = JsonColumnSchemaLocation.External;
            column.externalSchema = schema;
        } else if (
            schema != null &&
            typeof schema === "object" &&
            !Array.isArray(schema)
        ) {
            column.schemaLocation = JsonColumnSchemaLocation.Embedded;
            column.embeddedSchema = schema as Record<string, unknown>;
        } else if (schema !== undefined) {
            throw new CodeListParserError(
                `JSON type "${typeof schema}" not allowed.`
            );
        }

        return column;
    }

    /**
     * Converts this instance to a JSON object.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.Document,
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

        if (this.schemaLocation === JsonColumnSchemaLocation.External) {
            if (this.externalSchema != null) {
                json[PropertyNames.Schema] = this.externalSchema;
            }
        } else if (this.embeddedSchema != null) {
            json[PropertyNames.Schema] = this.embeddedSchema;
        }

        return json;
    }
}