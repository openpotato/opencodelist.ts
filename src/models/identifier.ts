import { IdentifierSource } from "./identifier-source.js";
import { PropertyNames } from "./../dictionaries/property-names.js";

/**
 * A general identifier.
 */
export class Identifier {

    /**
     * The identifier value.
     */
    public value!: string;

    /**
     * The source of the identifier.
     */
    public source: IdentifierSource | null = null;

    /**
     * Parses a JSON object into an Identifier instance.
     */
    static parse(json: Record<string, unknown>): Identifier {
        const identifier = new Identifier();

        const value = json[PropertyNames.Value];
        if (typeof value !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.Value}'.`
            );
        }
        identifier.value = value;

        const source = json[PropertyNames.Source];
        if (
            source != null &&
            typeof source === "object" &&
            !Array.isArray(source)
        ) {
            identifier.source = IdentifierSource.parse(
                source as Record<string, unknown>
            );
        }

        return identifier;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Value]: this.value,
        };

        if (this.source != null) {
            json[PropertyNames.Source] = this.source.toJSON();
        }

        return json;
    }
}