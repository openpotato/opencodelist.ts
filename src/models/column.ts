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
    public name!: string;

    /**
     * A human-readable description of the code list column.
     */
    public description: string | null = null;

    /**
     * A boolean that specifies whether the column value can be null.
     */
    public nullable: boolean | null = null;

    /**
     * A boolean that defines whether this column is optional,
     * i.e. whether it can be completely omitted from a data row.
     */
    public optional: boolean | null = null;

    /**
     * Converts this instance to a JSON object.
     */
    abstract toJSON(): Record<string, unknown>;
}