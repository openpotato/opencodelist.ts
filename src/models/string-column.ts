import { Column } from "./column.js";
import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";

/**
 * This is a string type column.
 */
export class StringColumn extends Column {
    /**
     * A language tag according to BCP 47 to specify the language of the content.
     */
    public language: string | null = null;

    /**
     * An integer that specifies the maximum character length of the value.
     */
    public maxLength: number | null = null;

    /**
     * An integer that specifies the minimum character length of the value.
     */
    public minLength: number | null = null;

    /**
     * A string that specifies a regular expression that must match against each value.
     */
    public pattern: string | null = null;

    /**
     * Parses a JSON object into a StringColumn instance.
     */
    static parse(json: Record<string, unknown>): StringColumn {
        const column = new StringColumn();

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

        const minLength = json[PropertyNames.MinLength];
        if (typeof minLength === "number") {
            column.minLength = minLength;
        }

        const maxLength = json[PropertyNames.MaxLength];
        if (typeof maxLength === "number") {
            column.maxLength = maxLength;
        }

        const pattern = json[PropertyNames.Pattern];
        if (typeof pattern === "string") {
            column.pattern = pattern;
        }

        const language = json[PropertyNames.Language];
        if (typeof language === "string") {
            column.language = language;
        }

        return column;
    }

    /**
     * Converts this instance to a JSON object.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.String,
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

        if (this.minLength != null) {
            json[PropertyNames.MinLength] = this.minLength;
        }

        if (this.maxLength != null) {
            json[PropertyNames.MaxLength] = this.maxLength;
        }

        if (this.pattern != null) {
            json[PropertyNames.Pattern] = this.pattern;
        }

        if (this.language != null) {
            json[PropertyNames.Language] = this.language;
        }

        return json;
    }
}