/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { Columns } from "./columns.js";
import type { CodeListDocument } from "./../code-list-document.js";

/**
 * A key definition.
 */
export class Key {

    /**
     * Creates a new key.
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
    public description: string | null = null;

    /**
     * The unique ID of the key.
     */
    public id!: string;

    /**
     * The name of the key.
     */
    public name: string | null = null;

    /**
     * Parses a JSON object into a Key instance.
     */
    static parse(
        json: Record<string, unknown>,
        codeList: CodeListDocument
    ): Key {
        const key = new Key(codeList);

        key.id = JsonUtils.getRequiredString(json, PropertyNames.Id);

        const name = JsonUtils.getString(json, PropertyNames.Name);
        if (name !== undefined) {
            key.name = name;
        }

        const description = JsonUtils.getString(json, PropertyNames.Description);
        if (description !== undefined) {
            key.description = description;
        }

        const columnIds = JsonUtils.getArray(json, PropertyNames.ColumnIds);
        if (columnIds !== undefined) {
            key.columns.parseAndAdd(columnIds);
        }

        return key;
    }

    /**
     * Converts this instance to a JSON object.
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