/*---------------------------------------------------------
 *  Copyright (c) STÜBER SYSTEMS GmbH. All rights reserved.
 *  Licensed under the MIT License.
 *---------------------------------------------------------*/

import { PropertyNames } from "./../dictionaries/property-names.js";
import { JsonUtils } from "./../utils/json-utils.js";
import { LocalizedUri } from "./localized-uri.js";
import { MimeTypedUri } from "./mime-typed-uri.js";
import { Publisher } from "./publisher.js";

/**
 * Meta information about a code list.
 */
export class Identification {

    /**
     * Suggested retrieval locations for this document,
     * in a format other than OpenCodeList.
     */
    public alternateFormatLocations: MimeTypedUri[] = [];

    /**
     * Suggested retrieval locations for this document,
     * in OpenCodeList format, but in a different language.
     */
    public alternateLanguageLocations: LocalizedUri[] = [];

    /**
     * Canonical URI which uniquely identifies all versions (collectively).
     */
    public canonicalUri!: string;

    /**
     * Canonical URI which uniquely identifies this version.
     */
    public canonicalVersionUri!: string;

    /**
     * A curated list of notable changes for the current version.
     */
    public readonly changeLog: string[] = [];

    /**
     * A list of tags or keywords that define what the document is about.
     */
    public readonly tags: string[] = [];

    /**
     * Language tag according to BCP 47.
     */
    public language?: string;

    /**
     * Suggested retrieval locations for this version,
     * in OpenCodeList format.
     */
    public locationUrls: string[] = [];

    /**
     * A human-readable name of the document.
     */
    public longName?: string;

    /**
     * Publication timestamp.
     */
    public publishedAt?: string;

    /**
     * Information about the publisher.
     */
    public publisher?: Publisher;

    /**
     * A short identifier of the document.
     */
    public shortName!: string;

    /**
     * The timestamp from which this document is valid.
     */
    public validFrom?: string;

    /**
     * The timestamp until which this document is valid.
     */
    public validTo?: string;

    /**
     * The version of the document.
     */
    public version?: string;

    /**
     * Parses a JSON object into an Identification instance.
     */
    static parse(json: Record<string, unknown>): Identification {
        const identification = new Identification();

        identification.shortName = JsonUtils.getRequiredString(json, PropertyNames.ShortName);
        identification.longName = JsonUtils.getString(json, PropertyNames.LongName) ?? undefined;
        identification.version = JsonUtils.getString(json, PropertyNames.Version) ?? undefined;
        identification.publishedAt = JsonUtils.getString(json, PropertyNames.PublishedAt) ?? undefined;
        identification.validFrom = JsonUtils.getString(json, PropertyNames.ValidFrom) ?? undefined;
        identification.validTo = JsonUtils.getString(json, PropertyNames.ValidTo) ?? undefined;
        identification.canonicalUri = JsonUtils.getRequiredString(json, PropertyNames.CanonicalUri);
        identification.canonicalVersionUri = JsonUtils.getRequiredString(json, PropertyNames.CanonicalVersionUri);
        identification.language = JsonUtils.getString(json, PropertyNames.Language) ?? undefined;

        const tags = JsonUtils.getStringArray(json, PropertyNames.Tags);
        if (tags !== undefined) {
            identification.tags.push(...tags);
        }

        const changeLog = JsonUtils.getStringArray(json, PropertyNames.ChangeLog);
        if (changeLog !== undefined) {
            identification.changeLog.push(...changeLog);
        }


        const publisher = JsonUtils.getObject(json, PropertyNames.Publisher);
        if (publisher !== undefined) {
            identification.publisher = Publisher.parse(publisher);
        }


        const locationUrls = JsonUtils.getStringArray(json, PropertyNames.LocationUrls);
        if (locationUrls !== undefined) {
            identification.locationUrls.push(...locationUrls);
        }

        const alternateLanguageLocations = JsonUtils.getObjectArray(
            json,
            PropertyNames.AlternateLanguageLocations,
            LocalizedUri.parse,
        );
        if (alternateLanguageLocations !== undefined) {
            identification.alternateLanguageLocations.push(...alternateLanguageLocations);
        }

        const alternateFormatLocations = JsonUtils.getObjectArray(
            json,
            PropertyNames.AlternateFormatLocations,
            MimeTypedUri.parse,
        );
        if (alternateFormatLocations !== undefined) {
            identification.alternateFormatLocations.push(...alternateFormatLocations);
        }

        return identification;
    }

    /**
     * Converts this instance to a JSON object.
     */
    toJSON(): Record<string, unknown> {
        const json: Record<string, unknown> = {
            [PropertyNames.ShortName]: this.shortName,
            [PropertyNames.CanonicalUri]: this.canonicalUri,
            [PropertyNames.CanonicalVersionUri]:
                this.canonicalVersionUri,
        };

        if (this.longName != null) {
            json[PropertyNames.LongName] = this.longName;
        }

        if (this.tags.length > 0) {
            json[PropertyNames.Tags] = [...this.tags];
        }

        if (this.publisher != null) {
            json[PropertyNames.Publisher] = this.publisher.toJSON();
        }

        if (this.version != null) {
            json[PropertyNames.Version] = this.version;
        }

        if (this.changeLog.length > 0) {
            json[PropertyNames.ChangeLog] = [...this.changeLog];
        }

        if (this.publishedAt != null) {
            json[PropertyNames.PublishedAt] = this.publishedAt;
        }

        if (this.validFrom != null) {
            json[PropertyNames.ValidFrom] = this.validFrom;
        }

        if (this.validTo != null) {
            json[PropertyNames.ValidTo] = this.validTo;
        }

        if (this.locationUrls.length > 0) {
            json[PropertyNames.LocationUrls] = [...this.locationUrls];
        }

        if (this.alternateLanguageLocations.length > 0) {
            json[PropertyNames.AlternateLanguageLocations] =
                this.alternateLanguageLocations.map((x) => x.toJSON());
        }

        if (this.alternateFormatLocations.length > 0) {
            json[PropertyNames.AlternateFormatLocations] =
                this.alternateFormatLocations.map((x) => x.toJSON());
        }

        if (this.language != null) {
            json[PropertyNames.Language] = this.language;
        }

        return json;
    }
}