/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { JsonUtils } from "../utils/json-utils.js";
import { Column } from "./column.js";
import { EnumMember } from "./enum-member.js";

/**
 * This is an enumeration set type column.
 */
export class EnumSetColumn extends Column {

    /**
     * A language tag according to BCP 47 to specify the language of the content.
     */
    public language?: string;

    /**
     * The list of allowed values for the enumeration set.
     */
    public readonly members: EnumMember[] = [];

    /**
     * Parses a JSON object into an EnumSetColumn instance.
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): EnumSetColumn {
        const column = Column.parseCommonProperties(new EnumSetColumn(), json);
        column.language = JsonUtils.getLanguageTag(json, PropertyNames.Language) ?? undefined;

        column.members.push(
            ...JsonUtils.getRequiredObjectArray(json, PropertyNames.Members, EnumMember.parse)
        );

        return column;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.EnumSet,
            [PropertyNames.Id]: this.id,
            [PropertyNames.Name]: this.name,
            [PropertyNames.Members]: this.members.map((m) => m.toJSON()),
        };

        if (this.description != null) {
            json[PropertyNames.Description] = this.description;
        }

        if (this.nullable != null) {
            json[PropertyNames.Nullable] = this.nullable;
        }

        if (this.optional != null) {
            json[PropertyNames.Optional] = this.optional;
        }

        if (this.language != null) {
            json[PropertyNames.Language] = this.language;
        }

        return json;
    }
}