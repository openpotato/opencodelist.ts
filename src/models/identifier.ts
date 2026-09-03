/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { IdentifierSource } from "./identifier-source.js";

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
    public source?: IdentifierSource;

    /**
     * Parses a JSON object into a Identifier instance.
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    public static parse(json: Record<string, unknown> | undefined): Identifier | undefined {
        if (json == null) {
            return undefined;
        }

        const identifier = new Identifier();

        identifier.value = JsonUtils.getRequiredString(json, PropertyNames.Value);
        identifier.source = IdentifierSource.parse(JsonUtils.getObject(json, PropertyNames.Source));

        return identifier;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
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