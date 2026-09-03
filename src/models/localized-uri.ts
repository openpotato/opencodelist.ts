/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";

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
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): LocalizedUri {
        const localizedUri = new LocalizedUri();

        localizedUri.language = JsonUtils.getRequiredLanguageTag(json, PropertyNames.Language);
        localizedUri.url = JsonUtils.getRequiredString(json, PropertyNames.Url);

        return localizedUri;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    toJSON(): Record<string, unknown> {
        return {
            [PropertyNames.Language]: this.language,
            [PropertyNames.Url]: this.url,
        };
    }
}