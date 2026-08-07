/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { SemVer } from "semver";
import { Annotation } from "./models/annotation.js";
import { Identification } from "./models/identification.js";

/**
 * The OpenCodeList version supported by this library.
 */
export const MINIMUM_COMPATIBLE_OPEN_CODE_LIST_VERSION = "0.3.0" as const;

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
 * CodeListSetDocument.
 */
export abstract class Document {
    private static readonly implementedVersion = new SemVer("0.3.0");
    private static readonly minimumCompatibleVersion = new SemVer("0.3.0");

    /**
     * Creates a new instance of the Document class.
     */
    constructor() {
        this.identification = new Identification();
    }

    /**
     * Serialization options.
     */
    public static readonly defaultSerializeOptions: Readonly<SerializeOptions> = {
        pretty: true,
        indent: 2,
    };

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
     * The implemented OpenCodeList version as string
     */
    public readonly version = Document.getImplementedVersion();

    /**
     * Returns the implemented OpenCodeList version.
     * 
     * @returns An OpenCodeList version
     */
    public static getImplementedVersion(): SemVer {
        return Document.implementedVersion;
    }

    /**
     * Returns the minimum compatible OpenCodeList version.
     * 
     * @returns An OpenCodeList version
     */
    public static getMinimumCompatibleVersion(): SemVer {
        return Document.minimumCompatibleVersion;
    }

    /**
     * Clears the metadata and content of this document instance.
     */
    clear(): void {
        this.annotation = null;
        this.comments.length = 0;
        this.identification = new Identification();
        this.clearContent(false);
    }

    /**
     * Clears only the content of this document instance.
     */
    clearContent(convertToMetaOnly: boolean): void {
        if (convertToMetaOnly) {
            this.metaOnly = true;
        }
    }

    /**
     * Converts this document to a JSON object.
     */
    abstract toJSON(metaOnly?: boolean): Record<string, unknown>;

    /**
     * Serializes this document as formatted JSON.
     */
    serialize(metaOnly = this.metaOnly, options?: SerializeOptions): string {
        const effective = {
            ...Document.defaultSerializeOptions,
            ...options,
        };

        const space = effective.pretty ? effective.indent : undefined;
        return JSON.stringify(this.toJSON(metaOnly), null, space);
    }

    /**
     * Serializes this document as formatted JSON with metadata only.
     */
    serializeMetaOnly(options?: SerializeOptions): string {
        return this.serialize(true, options);
    }
}