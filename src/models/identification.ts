import { LocalizedUri } from "./localized-uri.js";
import { MimeTypedUri } from "./mime-typed-uri.js";
import { Publisher } from "./publisher.js";
import { PropertyNames } from "./../dictionaries/property-names.js";

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
    public language: string | null = null;

    /**
     * Suggested retrieval locations for this version,
     * in OpenCodeList format.
     */
    public locationUrls: string[] = [];

    /**
     * A human-readable name of the document.
     */
    public longName: string | null = null;

    /**
     * Publication timestamp.
     */
    public publishedAt: string | null = null;

    /**
     * Information about the publisher.
     */
    public publisher: Publisher | null = null;

    /**
     * A short identifier of the document.
     */
    public shortName!: string;

    /**
     * The timestamp from which this document is valid.
     */
    public validFrom: string | null = null;

    /**
     * The timestamp until which this document is valid.
     */
    public validTo: string | null = null;

    /**
     * The version of the document.
     */
    public version: string | null = null;

    /**
     * Parses a JSON object into an Identification instance.
     */
    static parse(json: Record<string, unknown>): Identification {
        const identification = new Identification();

        const shortName = json[PropertyNames.ShortName];
        if (typeof shortName !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.ShortName}'.`
            );
        }
        identification.shortName = shortName;

        const longName = json[PropertyNames.LongName];
        if (typeof longName === "string") {
            identification.longName = longName;
        }

        const tags = json[PropertyNames.Tags];
        if (Array.isArray(tags)) {
            for (const tag of tags) {
                if (typeof tag === "string") {
                    identification.tags.push(tag);
                }
            }
        }

        const version = json[PropertyNames.Version];
        if (typeof version === "string") {
            identification.version = version;
        }

        const changeLog = json[PropertyNames.ChangeLog];
        if (Array.isArray(changeLog)) {
            for (const entry of changeLog) {
                if (typeof entry === "string") {
                    identification.changeLog.push(entry);
                }
            }
        }

        const publishedAt = json[PropertyNames.PublishedAt];
        if (typeof publishedAt === "string") {
            identification.publishedAt = publishedAt;
        }

        const publisher = json[PropertyNames.Publisher];
        if (
            publisher != null &&
            typeof publisher === "object" &&
            !Array.isArray(publisher)
        ) {
            identification.publisher = Publisher.parse(
                publisher as Record<string, unknown>
            );
        }

        const validFrom = json[PropertyNames.ValidFrom];
        if (typeof validFrom === "string") {
            identification.validFrom = validFrom;
        }

        const validTo = json[PropertyNames.ValidTo];
        if (typeof validTo === "string") {
            identification.validTo = validTo;
        }

        const canonicalUri = json[PropertyNames.CanonicalUri];
        if (typeof canonicalUri !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.CanonicalUri}'.`
            );
        }
        identification.canonicalUri = canonicalUri;

        const canonicalVersionUri =
            json[PropertyNames.CanonicalVersionUri];
        if (typeof canonicalVersionUri !== "string") {
            throw new Error(
                `Missing required property '${PropertyNames.CanonicalVersionUri}'.`
            );
        }
        identification.canonicalVersionUri = canonicalVersionUri;

        const locationUrls = json[PropertyNames.LocationUrls];
        if (Array.isArray(locationUrls)) {
            for (const url of locationUrls) {
                if (typeof url === "string") {
                    identification.locationUrls.push(url);
                }
            }
        }

        const alternateLanguageLocations =
            json[PropertyNames.AlternateLanguageLocations];
        if (Array.isArray(alternateLanguageLocations)) {
            for (const item of alternateLanguageLocations) {
                if (
                    item != null &&
                    typeof item === "object" &&
                    !Array.isArray(item)
                ) {
                    identification.alternateLanguageLocations.push(
                        LocalizedUri.parse(
                            item as Record<string, unknown>
                        )
                    );
                }
            }
        }

        const alternateFormatLocations =
            json[PropertyNames.AlternateFormatLocations];
        if (Array.isArray(alternateFormatLocations)) {
            for (const item of alternateFormatLocations) {
                if (
                    item != null &&
                    typeof item === "object" &&
                    !Array.isArray(item)
                ) {
                    identification.alternateFormatLocations.push(
                        MimeTypedUri.parse(
                            item as Record<string, unknown>
                        )
                    );
                }
            }
        }

        const language = json[PropertyNames.Language];
        if (typeof language === "string") {
            identification.language = language;
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