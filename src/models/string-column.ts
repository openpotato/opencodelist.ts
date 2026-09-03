/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { JsonUtils } from "../utils/json-utils.js";
import { Column } from "./column.js";

/**
 * This is a string type column.
 */
export class StringColumn extends Column {
    /**
     * A language tag according to BCP 47 to specify the language of the content.
     */
    public language?: string;

    /**
     * An integer that specifies the maximum character length of the value.
     */
    public maxLength?: number;

    /**
     * An integer that specifies the minimum character length of the value.
     */
    public minLength?: number;

    /**
     * A string that specifies a regular expression that must match against each value.
     */
    public pattern?: string;

    /**
     * Parses a JSON object into a StringColumn instance.
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): StringColumn {
        const column = Column.parseCommonProperties(new StringColumn(), json);
        column.minLength = JsonUtils.getInteger(json, PropertyNames.MinLength) ?? undefined;
        column.maxLength = JsonUtils.getInteger(json, PropertyNames.MaxLength) ?? undefined;
        column.pattern = JsonUtils.getString(json, PropertyNames.Pattern) ?? undefined;
        column.language = JsonUtils.getLanguageTag(json, PropertyNames.Language) ?? undefined;

        return column;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.String,
            [PropertyNames.Id]: this.id,
            [PropertyNames.Name]: this.name,
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

        if (this.minLength != null) {
            json[PropertyNames.MinLength] = this.minLength;
        }

        if (this.maxLength != null) {
            json[PropertyNames.MaxLength] = this.maxLength;
        }

        if (this.pattern != null) {
            json[PropertyNames.Pattern] = this.pattern;
        }

        if (this.language != null) {
            json[PropertyNames.Language] = this.language;
        }

        return json;
    }
}