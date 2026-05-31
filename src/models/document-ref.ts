/**
 * An external code list reference.
 */
export abstract class DocumentRef {

    /**
     * Canonical URI which uniquely identifies all versions (collectively).
     */
    public canonicalUri: string | null = null;

    /**
     * Canonical URI which uniquely identifies this version.
     */
    public canonicalVersionUri: string | null = null;

    /**
     * Suggested retrieval locations for this version, in OpenCodeList format.
     */
    public readonly locationUrls: string[] = [];

    /**
     * Converts this instance to a JSON object.
     */
    abstract toJSON(): Record<string, unknown>;
}