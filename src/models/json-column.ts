/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { JsonUtils } from "../utils/json-utils.js";
import { Column } from "./column.js";

/**
 * This is a column representing an embedded JSON object or array.
 */
export class JsonColumn extends Column {

    /**
     * URI to the JSON schema file.
     */
    public schemaUri?: string;

    /**
     * Parses a JSON object into a JsonColumn instance.
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): JsonColumn {
        const column = Column.parseCommonProperties(new JsonColumn(), json);

        column.schemaUri = JsonUtils.getString(json, PropertyNames.SchemaUri) ?? undefined;

        return column;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.Document,
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

        if (this.schemaUri != null) {
            json[PropertyNames.SchemaUri] = this.schemaUri;
        }

        return json;
    }
}