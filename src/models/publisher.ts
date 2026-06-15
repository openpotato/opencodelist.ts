/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { Identifier } from "./identifier.js";

/**
 * Publisher that is responsible for publication and/or maintenance of the document.
 */
export class Publisher {

    /**
     * Identifier for the publisher.
     */
    public identifier?: Identifier;

    /**
     * Human-readable name for the publisher.
     */
    public longName?: string;

    /**
     * Short name for the publisher.
     */
    public shortName!: string;

    /**
     * More information about the publisher.
     */
    public url?: string;

    /**
     * Parses a JSON object into a Publisher instance.
     */
    static parse(json: Record<string, unknown>): Publisher {
        const publisher = new Publisher();

        publisher.shortName = JsonUtils.getRequiredString(json, PropertyNames.ShortName);
        publisher.longName = JsonUtils.getString(json, PropertyNames.LongName) ?? undefined;
        publisher.url = JsonUtils.getString(json, PropertyNames.Url) ?? undefined;
        publisher.identifier = Identifier.parse(JsonUtils.getObject(json, PropertyNames.Identifier));

        return publisher;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.ShortName]: this.shortName,
        };

        if (this.longName != null) {
            json[PropertyNames.LongName] = this.longName;
        }

        if (this.identifier != null) {
            json[PropertyNames.Identifier] = this.identifier.toJSON();
        }

        if (this.url != null) {
            json[PropertyNames.Url] = this.url;
        }

        return json;
    }
}