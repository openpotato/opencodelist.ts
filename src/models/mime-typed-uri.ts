import { PropertyNames } from "./../dictionaries/property-names.js";

/**
 * A URI with an associated MIME type.
 */
export class MimeTypedUri {

    /**
     * The MIME type.
     */
    public mimeType!: string;

    /**
     * The URI.
     */
    public url!: string;

    /**
     * Parses a JSON object into a MimeTypedUri instance.
     */
    static parse(json: Record<string, unknown>): MimeTypedUri {
        const mimeTypedUri = new MimeTypedUri();

        const mimeType = json[PropertyNames.MimeType];
        if (typeof mimeType !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.MimeType}'.`
            );
        }
        mimeTypedUri.mimeType = mimeType;

        const url = json[PropertyNames.Url];
        if (typeof url !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.Url}'.`
            );
        }
        mimeTypedUri.url = url;

        return mimeTypedUri;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        return {
            [PropertyNames.MimeType]: this.mimeType,
            [PropertyNames.Url]: this.url,
        };
    }
}