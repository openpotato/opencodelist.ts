/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { DocumentRef } from "./document-ref.js";

/**
 * An external code list reference.
 */
export class CodeListDocumentRef extends DocumentRef {

    /**
     * Parses a JSON object into a CodeListDocumentRef instance.
     */
    static parse(json: Record<string, unknown>): CodeListDocumentRef {
        const documentRef = new CodeListDocumentRef();

        documentRef.canonicalUri = JsonUtils.getRequiredString(json, PropertyNames.CanonicalUri);
        documentRef.canonicalVersionUri = JsonUtils.getString(json, PropertyNames.CanonicalVersionUri) ?? undefined;

        const locationUrls = JsonUtils.getStringArray(json, PropertyNames.LocationUrls);
        if (locationUrls !== undefined) {
            documentRef.locationUrls.push(...locationUrls);
        }

        return documentRef;
    }

    /**
     * Converts this instance to a JSON object.
     */
    override toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Type]: TypeConsts.CodeListRef,
            [PropertyNames.CanonicalUri]: this.canonicalUri,
        };

        if (this.canonicalVersionUri != null) {
            json[PropertyNames.CanonicalVersionUri] =
                this.canonicalVersionUri;
        }

        if (this.locationUrls.length > 0) {
            json[PropertyNames.LocationUrls] = [...this.locationUrls];
        }

        return json;
    }
}