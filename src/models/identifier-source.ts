import { PropertyNames } from "./../dictionaries/property-names.js";

/**
 * Source information for a general identifier.
 */
export class IdentifierSource {

    /**
     * Human-readable name of the source.
     */
    public longName: string | null = null;

    /**
     * Short name of the source.
     */
    public shortName!: string;

    /**
     * More information about the source.
     */
    public url: string | null = null;

    /**
     * Parses a JSON object into an IdentifierSource instance.
     */
    static parse(json: Record<string, unknown>): IdentifierSource {
        const source = new IdentifierSource();

        const shortName = json[PropertyNames.ShortName];
        if (typeof shortName !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.ShortName}'.`
            );
        }
        source.shortName = shortName;

        const longName = json[PropertyNames.LongName];
        if (typeof longName === "string") {
            source.longName = longName;
        }

        const url = json[PropertyNames.Url];
        if (typeof url === "string") {
            source.url = url;
        }

        return source;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.ShortName]: this.shortName,
        };

        if (this.longName != null) {
            json[PropertyNames.LongName] = this.longName;
        }

        if (this.url != null) {
            json[PropertyNames.Url] = this.url;
        }

        return json;
    }
}