import { Columns } from "./columns.js";
import { PropertyNames } from "./../dictionaries/property-names.js";
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

        const id = json[PropertyNames.Id];
        if (typeof id !== "string") {
            throw new Error(`Missing required property '${PropertyNames.Id}'.`);
        }
        key.id = id;

        const name = json[PropertyNames.Name];
        if (typeof name === "string") {
            key.name = name;
        }

        const description = json[PropertyNames.Description];
        if (typeof description === "string") {
            key.description = description;
        }

        const columnIds = json[PropertyNames.ColumnIds];
        if (Array.isArray(columnIds)) {
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