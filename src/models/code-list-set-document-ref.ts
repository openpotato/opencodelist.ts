/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { Annotation } from "./annotation.js";
import { DocumentRef } from "./document-ref.js";

/**
 * Represents CodeListSetDocumentRef.
 */
export class CodeListSetDocumentRef extends DocumentRef {

    /**
     * Static method to parse a JSON object into a CodeListSetDocumentRef instance.
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): CodeListSetDocumentRef {
        const documentRef = new CodeListSetDocumentRef();
        documentRef.canonicalUri = JsonUtils.getRequiredString(json, PropertyNames.CanonicalUri);
        documentRef.canonicalVersionUri = JsonUtils.getString(json, PropertyNames.CanonicalVersionUri) ?? undefined;

        const annotation = JsonUtils.getObject(json, PropertyNames.Annotation);
        if (annotation !== undefined) {
            documentRef.annotation = Annotation.parse(annotation);
        }

        const locationUrls = JsonUtils.getStringArray(json, PropertyNames.LocationUrls);
        if (locationUrls !== undefined) {
            documentRef.locationUrls.push(...locationUrls);
        }

        return documentRef;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @param includeType - Whether to include the type property.   
     * @returns The JSON representation.
     */
    override toJSON(includeType = true): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.CanonicalUri]: this.canonicalUri,
        };

        if (includeType) {
            json[PropertyNames.Type] = TypeConsts.CodeListSetRef;
        }
        if (this.annotation != null) {
            json[PropertyNames.Annotation] = this.annotation.toJSON();
        }
        if (this.canonicalVersionUri != null) {
            json[PropertyNames.CanonicalVersionUri] = this.canonicalVersionUri;
        }
        if (this.locationUrls.length > 0) {
            json[PropertyNames.LocationUrls] = [...this.locationUrls];
        }
        return json;
    }
}
