import { Column } from "./column.js";
import { EnumMember } from "./enum-member.js";
import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";

/**
 * This is an enumeration set type column.
 */
export class EnumSetColumn extends Column {

    /**
     * A language tag according to BCP 47 to specify the language of the content.
     */
    public language: string | null = null;

    /**
     * The list of allowed values for the enumeration set.
     */
    public members: EnumMember[] = [];

    /**
     * Parses a JSON object into an EnumSetColumn instance.
     */
    static parse(json: Record<string, unknown>): EnumSetColumn {
        const column = new EnumSetColumn();

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

        const members = json[PropertyNames.Members];
        if (Array.isArray(members)) {
            for (const member of members) {
                if (
                    member != null &&
                    typeof member === "object" &&
                    !Array.isArray(member)
                ) {
                    column.members.push(
                        EnumMember.parse(member as Record<string, unknown>)
                    );
                }
            }
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
            [PropertyNames.Type]: TypeConsts.EnumSet,
            [PropertyNames.Id]: this.id,
            [PropertyNames.Name]: this.name,
            [PropertyNames.Members]: this.members.map((m) => m.toJSON()),
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

        if (this.language != null) {
            json[PropertyNames.Language] = this.language;
        }

        return json;
    }
}