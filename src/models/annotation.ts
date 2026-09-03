/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { Description } from "./description.js";

/**
 * Custom user annotation information.
 */
export class Annotation {

    /**
     * Machine-readable information.
     */
    public appInfo?: Record<string, unknown>;

    /**
     * Human-readable descriptions.
     */
    public readonly descriptions: Description[] = [];

    /**
     * Parses a JSON object into an Annotation instance.
     *
     * @param json - The JSON object instance.
     * @returns The parsed instance.
     */
    static parse(json: Record<string, unknown>): Annotation {
        const annotation = new Annotation();

        const descriptions = JsonUtils.getObjectArray(json, PropertyNames.Descriptions, Description.parse);
        if (descriptions !== undefined) {
            annotation.descriptions.push(...descriptions);
        }

        annotation.appInfo = JsonUtils.getObject(json, PropertyNames.AppInfo) ?? undefined;

        return annotation;
    }

    /**
     * Serializes this instance to a JSON object.
     *
     * @returns The JSON representation.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {};

        if (this.descriptions.length > 0) {
            json[PropertyNames.Descriptions] = this.descriptions.map((x) => x.toJSON());
        }

        if (this.appInfo != null) {
            json[PropertyNames.AppInfo] = this.appInfo;
        }

        return json;
    }
}
