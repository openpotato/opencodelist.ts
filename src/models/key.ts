/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { Columns } from "./columns.js";
import type { CodeListDocument } from "./../code-list-document.js";
import type { LocalizableString } from "./localizable-string.js";

/**
 * A key definition.
 */
export class Key {

    /**
     * Creates a new key.
     *
     * @param document - The document value.
     * @returns The new instance.
     */
    constructor(document: CodeListDocument) {
        this.columns = new Columns(document);
    }

    /**
     * A list of referenced columns.
     */
    public readonly columns: Columns;

    /**
     * A brief description of the key.
     */
    public description: LocalizableString | null = null;

    /**
     * The unique ID of the key.
     */
    public id!: string;

    /**
     * The name of the key.
     */
    public name: LocalizableString | null = null;

    /**
     * Parses a JSON object into a Key instance.
     *
     * @param json - The JSON object instance.
     * @param codeList - The CodeListDocument instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>, codeList: CodeListDocument): Key {
        const key = new Key(codeList);

        key.id = JsonUtils.getRequiredString(json, PropertyNames.Id);

        const name = JsonUtils.getLocalizableString(json, PropertyNames.Name);
        if (name !== undefined) {
            key.name = name;
        }

        const description = JsonUtils.getLocalizableString(json, PropertyNames.Description);
        if (description !== undefined) {
            key.description = description;
        }

        key.columns.parseAndAdd(
            JsonUtils.getRequiredArray(json, PropertyNames.ColumnIds)
        );

        return key;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Id]: this.id,
            [PropertyNames.ColumnIds]: [...this.columns].map(
                (column) => column.id
            ),
        };

        if (this.name != null) {
            json[PropertyNames.Name] = this.name;
        }

        if (this.description != null) {
            json[PropertyNames.Description] = this.description;
        }

        return json;
    }
}