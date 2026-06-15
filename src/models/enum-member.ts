/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";

/**
 * An enumeration member.
 */
export class EnumMember {

    /**
     * A short description of the value.
     */
    public description?: string;

    /**
     * The value.
     */
    public value!: string;

    /**
     * Parses a JSON object into an EnumMember instance.
     */
    static parse(json: Record<string, unknown>): EnumMember {
        const enumMember = new EnumMember();

        enumMember.value = JsonUtils.getRequiredString(json, PropertyNames.Value);
        enumMember.description = JsonUtils.getString(json, PropertyNames.Description) ?? undefined;

        return enumMember;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Value]: this.value,
        };

        if (this.description != null) {
            json[PropertyNames.Description] = this.description;
        }

        return json;
    }
}