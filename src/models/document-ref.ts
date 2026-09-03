/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { Annotation } from "./annotation.js";

/**
 * An external OpenCodeList document reference.
 */
export abstract class DocumentRef {

    /**
     * User annotation information.
     */
    public annotation?: Annotation;

    /**
     * Canonical URI which uniquely identifies all versions (collectively).
     */
    public canonicalUri!: string;

    /**
     * Canonical URI which uniquely identifies this version.
     */
    public canonicalVersionUri?: string;

    /**
     * Suggested retrieval locations for this version, in OpenCodeList format.
     */
    public readonly locationUrls: string[] = [];

    /**
     * Serializes this instance to a JSON object.
     *
     * @param includeType - The includeType value.
     * @returns The JSON representation.
     */
    abstract toJSON(includeType?: boolean): Record<string, unknown>;
}
