import { PropertyNames } from "./../dictionaries/property-names.js";

/**
 * A URI with an associated language tag.
 */
export class LocalizedUri {

    /**
     * A language tag according to BCP 47.
     */
    public language!: string;

    /**
     * The URI.
     */
    public url!: string;

    /**
     * Parses a JSON object into a LocalizedUri instance.
     */
    static parse(json: Record<string, unknown>): LocalizedUri {
        const localizedUri = new LocalizedUri();

        const language = json[PropertyNames.Language];
        if (typeof language !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.Language}'.`
            );
        }
        localizedUri.language = language;

        const url = json[PropertyNames.Url];
        if (typeof url !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.Url}'.`
            );
        }
        localizedUri.url = url;

        return localizedUri;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        return {
            [PropertyNames.Language]: this.language,
            [PropertyNames.Url]: this.url,
        };
    }
}