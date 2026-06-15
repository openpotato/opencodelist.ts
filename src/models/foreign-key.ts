/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { Columns } from "./columns.js";
import { KeyRef } from "./key-ref.js";
import { CodeListDocument } from "./../code-list-document.js";

/**
 * A foreign key definition.
 */
export class ForeignKey {

    /**
     * Creates a new foreign key.
     */
    constructor(document: CodeListDocument) {
        this.columns = new Columns(document);
        this.keyRef = new KeyRef();
    }

    /**
     * A list of column IDs in the current code list.
     */
    public readonly columns: Columns;

    /**
     * A short description of the foreign key.
     */
    public description?: string;

    /**
     * The ID of the foreign key.
     */
    public id!: string;

    /**
     * The name of the foreign key.
     */
    public name?: string;

    /**
     * A reference to a key in another code list.
     */
    public keyRef!: KeyRef;

    /**
     * Parses a JSON object into a ForeignKey instance.
     */
    static parse(json: Record<string, unknown>, codeList: CodeListDocument): ForeignKey {
        const foreignKey = new ForeignKey(codeList);

        foreignKey.id = JsonUtils.getRequiredString(json, PropertyNames.Id);
        foreignKey.name = JsonUtils.getString(json, PropertyNames.Name) ?? undefined;
        foreignKey.description = JsonUtils.getString(json, PropertyNames.Description) ?? undefined;
        foreignKey.keyRef = KeyRef.parse(JsonUtils.getRequiredObject(json, PropertyNames.KeyRef));

        const columnIds = JsonUtils.getArray(json, PropertyNames.ColumnIds);
        if (columnIds !== undefined) {
            foreignKey.columns.parseAndAdd(columnIds);
        }

        return foreignKey;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {};

        if (this.id != null) {
            json[PropertyNames.Id] = this.id;
        }

        if (this.name != null) {
            json[PropertyNames.Name] = this.name;
        }

        if (this.description != null) {
            json[PropertyNames.Description] = this.description;
        }

        json[PropertyNames.ColumnIds] = [...this.columns].map(
            (column) => column.id
        );

        if (this.keyRef != null) {
            json[PropertyNames.KeyRef] = this.keyRef.toJSON();
        }

        return json;
    }
}