/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import type { LocalizableString } from "./localizable-string.js";

/**
 * An enumeration member.
 */
export class EnumMember {

    /**
     * A short description of the value.
     */
    public description?: LocalizableString;

    /**
     * The value.
     */
    public value!: string;

    /**
     * Parses a JSON object into an EnumMember instance.
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): EnumMember {
        const enumMember = new EnumMember();

        enumMember.value = JsonUtils.getRequiredString(json, PropertyNames.Value);
        enumMember.description = JsonUtils.getLocalizableString(json, PropertyNames.Description) ?? undefined;

        return enumMember;
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

        if (this.description != null) {
            json[PropertyNames.Description] = this.description;
        }

        return json;
    }
}