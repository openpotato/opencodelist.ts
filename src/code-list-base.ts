/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { SemVer, Range } from "semver";
import { Annotation } from "./models/annotation.js";
import { Identification } from "./models/identification.js";

/**
 * Options for JSON serialization.
 */
export interface SerializeOptions {

    /**
     * TRUE for pretty-printed JSON.
     */
    pretty?: boolean;

    /**
     * Indentation width used when pretty printing is enabled.
     */
    indent?: number;
}

/**
 * An abstract OpenCodeList base document for CodeListDocument and
 */
export abstract class CodeListBase {

    /**
     * Creates a new instance of the Document class.
     *
     * @returns The new instance.
     */
    constructor() {
        this.identification = new Identification();
    }

    /**
     * Serialization options.
     */
    protected static readonly defaultSerializeOptions: Readonly<SerializeOptions> = {
        pretty: true,
        indent: 2,
    };

    /**
     * Returns the implemented OpenCodeList version.
     */
    public static readonly implementedVersion = new SemVer("0.4.0");

    /**
     * Returns the minimum compatible OpenCodeList version.
     */
    public static readonly minimumCompatibleVersion = new SemVer("0.4.0");

    /**
     * The range of OpenCodeList versions supported by this library.
     */
    public static readonly supportedVersionRange = new Range(
        `>=${CodeListBase.minimumCompatibleVersion.version} <0.5.0`
    );

    /**
     * The implemented OpenCodeList version as string.
     */
    public static readonly version: string = CodeListBase.implementedVersion.version;

    /**
     * Annotations for the document.
     */
    public annotation: Annotation | null = null;

    /**
     * Comments for the document.
     */
    public comments: string[] = [];

    /**
     * Meta information about the document.
     */
    public identification: Identification;

    /**
     * TRUE if this document is a meta document.
     */
    public metaOnly: boolean = true;

    /**
     * Clears the metadata and content of this document instance.
     *
     * @returns No return value.
     */
    clear(): void {
        this.annotation = null;
        this.comments.length = 0;
        this.identification = new Identification();
        this.clearContent(false);
    }

    /**
     * Clears only the content of this document instance.
     *
     * @param convertToMetaOnly - The convertToMetaOnly value.
     * @returns No return value.
     */
    clearContent(convertToMetaOnly: boolean): void {
        if (convertToMetaOnly) {
            this.metaOnly = true;
        }
    }

    /**
     * Converts this document to a JSON object.
     *
     * @param metaOnly - The metaOnly value.
     * @returns The JSON representation.
     */
    abstract toJSON(metaOnly?: boolean): Record<string, unknown>;

    /**
     * Serializes this document as formatted JSON.
     *
     * @param options - The options value.
     * @returns The operation result.
     */
    serialize(metaOnly = this.metaOnly, options?: SerializeOptions): string {
        const effective = {
            ...CodeListBase.defaultSerializeOptions,
            ...options,
        };

        const space = effective.pretty ? effective.indent : undefined;
        return JSON.stringify(this.toJSON(metaOnly), null, space);
    }

    /**
     * Serializes this document as formatted JSON with metadata only.
     *
     * @param options - The options value.
     * @returns The operation result.
     */
    serializeMetaOnly(options?: SerializeOptions): string {
        return this.serialize(true, options);
    }
}