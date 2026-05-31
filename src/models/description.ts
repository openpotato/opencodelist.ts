import { PropertyNames } from './../dictionaries/property-names.js';

/**
 * Human-readable description.
 */
export class Description {

    /**
     * Description content.
     */
    public content!: string;

    /**
     * Format of the description content.
     */
    public format!: string;

    /**
     * Optional language tag according to https://www.rfc-editor.org/rfc/bcp/bcp47.txt to specify the language of the comment.        
     */
    public language: string | null = null;

    /**
     * Parses a JSON object into a Description instance.
     */
    static parse(json: Record<string, unknown>): Description {
        const description = new Description();

        const language =
            typeof json[PropertyNames.Language] === "string"
                ? (json[PropertyNames.Language] as string)
                : null;

        const format = json[PropertyNames.Format];
        if (typeof format !== "string") {
            throw new Error(`Missing required property '${PropertyNames.Format}'.`);
        }

        const content = json[PropertyNames.Content];
        if (typeof content !== "string") {
            throw new Error(`Missing required property '${PropertyNames.Content}'.`);
        }

        description.content = content;
        description.format = format;
        description.language = language;

        return description;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Format]: this.format,
            [PropertyNames.Content]: this.content,
        };

        if (this.language !== null) {
            json[PropertyNames.Language] = this.language;
        }

        return json;
    }
}