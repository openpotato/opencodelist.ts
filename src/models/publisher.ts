import { Identifier } from "./identifier.js";
import { PropertyNames } from "./../dictionaries/property-names.js";

/**
 * Publisher that is responsible for publication and/or maintenance of the document.
 */
export class Publisher {

    /**
     * Identifier for the publisher.
     */
    public identifier: Identifier | null = null;

    /**
     * Human-readable name for the publisher.
     */
    public longName: string | null = null;

    /**
     * Short name for the publisher.
     */
    public shortName!: string;

    /**
     * More information about the publisher.
     */
    public url: string | null = null;

    /**
     * Parses a JSON object into a Publisher instance.
     */
    static parse(json: Record<string, unknown>): Publisher {
        const publisher = new Publisher();

        const shortName = json[PropertyNames.ShortName];
        if (typeof shortName !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.ShortName}'.`
            );
        }
        publisher.shortName = shortName;

        const longName = json[PropertyNames.LongName];
        if (typeof longName === "string") {
            publisher.longName = longName;
        }

        const identifier = json[PropertyNames.Identifier];
        if (
            identifier != null &&
            typeof identifier === "object" &&
            !Array.isArray(identifier)
        ) {
            publisher.identifier = Identifier.parse(
                identifier as Record<string, unknown>
            );
        }

        const url = json[PropertyNames.Url];
        if (typeof url === "string") {
            publisher.url = url;
        }

        return publisher;
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

        if (this.identifier != null) {
            json[PropertyNames.Identifier] = this.identifier.toJSON();
        }

        if (this.url != null) {
            json[PropertyNames.Url] = this.url;
        }

        return json;
    }
}