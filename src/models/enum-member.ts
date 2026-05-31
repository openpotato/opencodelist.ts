import { PropertyNames } from "./../dictionaries/property-names.js";

/**
 * An enumeration member.
 */
export class EnumMember {

    /**
     * A short description of the value.
     */
    public description: string | null = null;

    /**
     * The value.
     */
    public value!: string;

    /**
     * Parses a JSON object into an EnumMember instance.
     */
    static parse(json: Record<string, unknown>): EnumMember {
        const enumMember = new EnumMember();

        const value = json[PropertyNames.Value];
        if (typeof value !== "string") {
            throw new Error(`Missing required property '${PropertyNames.Value}'.`);
        }
        enumMember.value = value;

        const description = json[PropertyNames.Description];
        if (typeof description === "string") {
            enumMember.description = description;
        }

        return enumMember;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Value]: this.value,
        };

        if (this.description != null) {
            json[PropertyNames.Description] = this.description;
        }

        return json;
    }
}