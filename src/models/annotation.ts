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
     */
    static parse(json: Record<string, unknown>): Annotation {
        const annotation = new Annotation();

        annotation.descriptions.push(
            ...JsonUtils.getRequiredObjectArray(
                json,
                PropertyNames.Descriptions,
                Description.parse,
            ),
        );

        annotation.appInfo = JsonUtils.getObject(json, PropertyNames.AppInfo) ?? undefined;

        return annotation;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.Descriptions]: this.descriptions.map((x) => x.toJSON()),
        };

        if (this.appInfo != null) {
            json[PropertyNames.AppInfo] = this.appInfo;
        }

        return json;
    }
}