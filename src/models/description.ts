/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from './../dictionaries/property-names.js';
import { JsonUtils } from "./../utils/json-utils.js";

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
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): Description {
        const description = new Description();

        description.format = JsonUtils.getRequiredString(json, PropertyNames.Format);
        description.content = JsonUtils.getRequiredString(json, PropertyNames.Content);
        description.language = JsonUtils.getLanguageTag(json, PropertyNames.Language) ?? null;

        return description;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
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