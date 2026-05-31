import { PropertyNames } from "./../dictionaries/property-names.js";
import { Description } from "./description.js";

/**
 * Custom user annotation information.
 */
export class Annotation {

    /**
     * Machine-readable information.
     */
    public appInfo: Record<string, unknown> | null = null;

    /**
     * Human-readable descriptions.
     */
    public readonly descriptions: Description[] = [];

    /**
     * Parses a JSON object into an Annotation instance.
     */
    static parse(json: Record<string, unknown>): Annotation {
        const annotation = new Annotation();

        const descriptions = json[PropertyNames.Descriptions];
        if (Array.isArray(descriptions)) {
            for (const item of descriptions) {
                if (item != null && typeof item === "object" && !Array.isArray(item)) {
                    annotation.descriptions.push(
                        Description.parse(item as Record<string, unknown>)
                    );
                }
            }
        } else {
            throw new Error(
                `Missing required property '${PropertyNames.Descriptions}'.`
            );
        }

        const appInfo = json[PropertyNames.AppInfo];
        if (appInfo != null && typeof appInfo === "object" && !Array.isArray(appInfo)) {
            annotation.appInfo = appInfo as Record<string, unknown>;
        }

        return annotation;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Descriptions]: this.descriptions.map((x) => x.toJSON()),
        };

        if (this.appInfo != null) {
            json[PropertyNames.AppInfo] = this.appInfo;
        }

        return json;
    }
}