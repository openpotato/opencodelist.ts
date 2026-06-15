/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";

/**
 * Source information for a general identifier.
 */
export class IdentifierSource {

    /**
     * Human-readable name of the source.
     */
    public longName?: string;

    /**
     * Short name of the source.
     */
    public shortName!: string;

    /**
     * More information about the source.
     */
    public url?: string;

    /**
     * Parses a JSON object into an IdentifierSource instance.
     */
    public static parse(json: Record<string, unknown> | undefined): IdentifierSource | undefined {
        if (json == null) {
            return undefined;
        }

        const source = new IdentifierSource();

        source.shortName = JsonUtils.getRequiredString(json, PropertyNames.ShortName);
        source.longName = JsonUtils.getString(json, PropertyNames.LongName) ?? undefined;
        source.url = JsonUtils.getString(json, PropertyNames.Url) ?? undefined;

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