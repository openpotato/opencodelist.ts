import { Columns } from "./columns.js";
import { KeyRef } from "./key-ref.js";
import { PropertyNames } from "./../dictionaries/property-names.js";
import type { CodeListDocument } from "./../code-list-document.js";

/**
 * A foreign key definition.
 */
export class ForeignKey {

    /**
     * Creates a new foreign key.
     */
    constructor(document: CodeListDocument) {
        this.columns = new Columns(document);
    }

    /**
     * A list of column IDs in the current code list.
     */
    public readonly columns: Columns;

    /**
     * A short description of the foreign key.
     */
    public description: string | null = null;

    /**
     * The ID of the foreign key.
     */
    public id: string | null = null;

    /**
     * The name of the foreign key.
     */
    public name: string | null = null;

    /**
     * A reference to a key in another code list.
     */
    public keyRef: KeyRef | null = null;

    /**
     * Parses a JSON object into a ForeignKey instance.
     */
    static parse(
        json: Record<string, unknown>,
        codeList: CodeListDocument
    ): ForeignKey {
        const foreignKey = new ForeignKey(codeList);

        const id = json[PropertyNames.Id];
        if (typeof id === "string") {
            foreignKey.id = id;
        }

        const name = json[PropertyNames.Name];
        if (typeof name === "string") {
            foreignKey.name = name;
        }

        const description = json[PropertyNames.Description];
        if (typeof description === "string") {
            foreignKey.description = description;
        }

        const columnIds = json[PropertyNames.ColumnIds];
        if (Array.isArray(columnIds)) {
            foreignKey.columns.parseAndAdd(columnIds);
        }

        const keyRef = json[PropertyNames.KeyRef];
        if (
            keyRef != null &&
            typeof keyRef === "object" &&
            !Array.isArray(keyRef)
        ) {
            foreignKey.keyRef = KeyRef.parse(
                keyRef as Record<string, unknown>
            );
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