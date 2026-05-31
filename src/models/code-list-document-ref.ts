import { DocumentRef } from "./document-ref.js";
import { PropertyNames } from "./../dictionaries/property-names.js";
import { TypeConsts } from "./../dictionaries/type-consts.js";

/**
 * An external code list reference.
 */
export class CodeListDocumentRef extends DocumentRef {

    /**
     * Parses a JSON object into a CodeListDocumentRef instance.
     */
    static parse(json: Record<string, unknown>): CodeListDocumentRef {
        const documentRef = new CodeListDocumentRef();

        const canonicalUri = json[PropertyNames.CanonicalUri];
        if (typeof canonicalUri !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.CanonicalUri}'.`
            );
        }
        documentRef.canonicalUri = canonicalUri;

        const canonicalVersionUri =
            json[PropertyNames.CanonicalVersionUri];
        if (typeof canonicalVersionUri === "string") {
            documentRef.canonicalVersionUri = canonicalVersionUri;
        }

        const locationUrls = json[PropertyNames.LocationUrls];
        if (Array.isArray(locationUrls)) {
            for (const locationUrl of locationUrls) {
                if (typeof locationUrl === "string") {
                    documentRef.locationUrls.push(locationUrl);
                }
            }
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