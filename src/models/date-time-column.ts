/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { JsonUtils } from "../utils/json-utils.js";
import { Column } from "./column.js";

/**
 * This is a date-time type column. The serialized format must match the native JSON string
 * with the JSON Schema format `date-time`.
 *
 * See: https://json-schema.org/understanding-json-schema/reference/string
 */
export class DateTimeColumn extends Column {

    /**
     * A value that specifies the maximum allowed value.
     */
    public maxValue?: string;

    /**
     * A value that specifies the minimum allowed value.
     */
    public minValue?: string;

    /**
     * Parses a JSON object into a DateTimeColumn instance.
     */
    static parse(json: Record<string, unknown>): DateTimeColumn {
        const column = new DateTimeColumn();

        column.id = JsonUtils.getRequiredString(json, PropertyNames.Id);
        column.name = JsonUtils.getRequiredString(json, PropertyNames.Name);
        column.description = JsonUtils.getString(json, PropertyNames.Description) ?? undefined;
        column.nullable = JsonUtils.getBoolean(json, PropertyNames.Nullable) ?? undefined;
        column.optional = JsonUtils.getBoolean(json, PropertyNames.Optional) ?? undefined;
        column.minValue = JsonUtils.getString(json, PropertyNames.MinValue) ?? undefined;
        column.maxValue = JsonUtils.getString(json, PropertyNames.MaxValue) ?? undefined;

        return column;
    }

    /**
     * Converts this instance to a JSON object.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.DateTime,
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

        if (this.minValue != null) {
            json[PropertyNames.MinValue] = this.minValue;
        }

        if (this.maxValue != null) {
            json[PropertyNames.MaxValue] = this.maxValue;
        }

        return json;
    }
}