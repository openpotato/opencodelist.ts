/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { JsonUtils } from "../utils/json-utils.js";
import { Column } from "./column.js";

/**
 * This is a float type column.
 */
export class NumberColumn extends Column {

    /**
     * A number value representing an exclusive upper limit for a value.
     */
    public exclusiveMaxValue?: number;

    /**
     * A number value representing an exclusive lower limit for a value.
     */
    public exclusiveMinValue?: number;

    /**
     * A number value that specifies the maximum allowed value.
     */
    public maxValue?: number;

    /**
     * A number value that specifies the minimum allowed value.
     */
    public minValue?: number;

    /**
     * Parses a JSON object into a NumberColumn instance.
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): NumberColumn {
        const column = Column.parseCommonProperties(new NumberColumn(), json);
        column.minValue = JsonUtils.getNumber(json, PropertyNames.MinValue) ?? undefined;
        column.maxValue = JsonUtils.getNumber(json, PropertyNames.MaxValue) ?? undefined;
        column.exclusiveMinValue = JsonUtils.getNumber(json, PropertyNames.ExclusiveMinValue) ?? undefined;
        column.exclusiveMaxValue = JsonUtils.getNumber(json, PropertyNames.ExclusiveMaxValue) ?? undefined;

        return column;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.Number,
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

        if (this.exclusiveMinValue != null) {
            json[PropertyNames.ExclusiveMinValue] = this.exclusiveMinValue;
        }

        if (this.exclusiveMaxValue != null) {
            json[PropertyNames.ExclusiveMaxValue] = this.exclusiveMaxValue;
        }

        return json;
    }
}