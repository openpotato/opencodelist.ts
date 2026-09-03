/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import type { LocalizableString } from "./localizable-string.js";

/**
 * A code list column.
 */
export abstract class Column {

    /**
     * The ID of the code list column.
     */
    public id!: string;

    /**
     * The name of the code list column.
     */
    public name!: LocalizableString;

    /**
     * A human-readable description of the code list column.
     */
    public description?: LocalizableString;

    /**
     * A boolean that specifies whether the column value can be null.
     */
    public nullable: boolean = false;

    /**
     * A boolean that defines whether this column is optional,
     */
    public optional: boolean = false;

    /**
     * Parses the properties shared by all column types.
     */
    protected static parseCommonProperties<TColumn extends Column>(column: TColumn, json: Record<string, unknown>): TColumn {
        column.id = JsonUtils.getRequiredString(json, PropertyNames.Id);
        column.name = JsonUtils.getRequiredLocalizableString(json, PropertyNames.Name);
        column.description = JsonUtils.getLocalizableString(json, PropertyNames.Description) ?? undefined;
        column.nullable = JsonUtils.getBoolean(json, PropertyNames.Nullable) ?? false;
        column.optional = JsonUtils.getBoolean(json, PropertyNames.Optional) ?? false;

        return column;
    }

    /**
     * Converts this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    abstract toJSON(): Record<string, unknown>;
}