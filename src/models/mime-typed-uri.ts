/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";

/**
 * A URI with an associated MIME type.
 */
export class MimeTypedUri {

    /**
     * The MIME type.
     */
    public mimeType!: string;

    /**
     * The URI.
     */
    public url!: string;

    /**
     * Parses a JSON object into a MimeTypedUri instance.
     */
    static parse(json: Record<string, unknown>): MimeTypedUri {
        const mimeTypedUri = new MimeTypedUri();

        mimeTypedUri.mimeType = JsonUtils.getRequiredString(json, PropertyNames.MimeType);
        mimeTypedUri.url = JsonUtils.getRequiredString(json, PropertyNames.Url);

        return mimeTypedUri;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        return {
            [PropertyNames.MimeType]: this.mimeType,
            [PropertyNames.Url]: this.url,
        };
    }
}