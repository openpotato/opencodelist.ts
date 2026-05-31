import { describe, expect, it } from "vitest";

import { CodeListDocument } from "../src/code-list-document.js";
import { DocumentFixture } from "./document-fixture.js";

describe("CodeListDocument", () => {
    it("Read_Test", async () => {
        const document = CodeListDocument.parse(await DocumentFixture.loadAssetJson("codelist.json"));

        expect(document).toBeDefined();
        expect(document.metaOnly).toBe(false);
        expect(document.comments[0]).toBe("This is a comment.");
        expect(document.annotation?.descriptions[0]?.format).toBe("markdown");
        expect(document.annotation?.descriptions[0]?.language).toBe("de");
        expect(document.annotation?.descriptions[0]?.content).toBe("Das ist eine **Anmerkung**.");
        expect(document.identification.shortName).toBe("TestCodeList");
        expect(document.identification.longName).toBe("A test code list");
        expect(document.identification.publisher?.shortName).toBe("OpenPotato");
        expect(document.identification.publisher?.longName).toBe("The OpenPotato Project");
        expect(document.identification.publisher?.identifier?.source?.shortName).toBe("TrustMe");
        expect(document.identification.publisher?.identifier?.value).toBe("42");
        expect(document.identification.alternateLanguageLocations[0]?.language).toBe("de");
        expect(document.identification.alternateLanguageLocations[0]?.url).toBe("https://example.com/codelist-2025-01-01.de.json");
        expect(document.identification.alternateFormatLocations[0]?.mimeType).toBe("text/csv");
        expect(document.identification.alternateFormatLocations[0]?.url).toBe("https://example.com/codelist-2025-01-01.csv");
        expect(document.columns.count).toBe(11);
        expect(document.columns.getAt(0).id).toBe("code");
        expect(document.rows.count).toBe(3);
        expect(document.rows.getAt(0).get("code")).toBe("c-1");
        expect(document.rows.getAt(0).get("federalState")).toBe("BW");
        expect(document.rows.getAt(0).get("integer")).toBe(42);
        expect(document.rows.getAt(0).get("number")).toBe(41.99);
        expect(document.rows.getAt(0).get("bool")).toBe(true);
        expect(document.rows.getAt(0).get("enumSet")).toEqual(["e1", "e3"]);
        expect(document.rows.getAt(1).get("code")).toBe("c-2");
        expect(document.rows.getAt(1).get("federalState")).toBe("BE");
        expect(document.rows.getAt(1).get("bool")).toBe(false);
        expect(document.rows.getAt(1).get("enumSet")).toEqual([]);
    });

    it("Write_Test", async () => {
        const originalDocument = CodeListDocument.parse(await DocumentFixture.loadAssetJson("codelist.json"));
        const copiedDocument = await DocumentFixture.writeAndParseTempJson(
            "codelist.copy.json",
            originalDocument.serialize(false, { pretty: true, indent: 2 }),
            CodeListDocument.parse
        );

        expect(() => copiedDocument.rows.getAt(0).set("bool", "string")).toThrow();
        expect(() => copiedDocument.rows.getAt(0).set("enumSet", "string")).toThrow();

        expect(originalDocument.metaOnly).toBe(false);
        expect(copiedDocument.metaOnly).toBe(false);

        expect(copiedDocument.annotation?.descriptions).toEqual(originalDocument.annotation?.descriptions);
        expect(copiedDocument.annotation?.appInfo).toEqual(originalDocument.annotation?.appInfo);
        expect(copiedDocument.identification).toEqual(originalDocument.identification);

        expect(copiedDocument.columns.count).toBe(originalDocument.columns.count);
        expect(copiedDocument.keys.count).toBe(originalDocument.keys.count);
        expect(copiedDocument.defaultKey?.id).toBe(originalDocument.defaultKey?.id);
        expect(copiedDocument.foreignKeys.count).toBe(originalDocument.foreignKeys.count);

        expect(copiedDocument.rows.count).toBe(originalDocument.rows.count);
        expect(copiedDocument.rows.getAt(0).get("code")).toBe(originalDocument.rows.getAt(0).get("code"));
        expect(copiedDocument.rows.getAt(0).get("federalState")).toBe(originalDocument.rows.getAt(0).get("federalState"));
        expect(copiedDocument.rows.getAt(0).get("integer")).toBe(originalDocument.rows.getAt(0).get("integer"));
        expect(copiedDocument.rows.getAt(0).get("number")).toBe(originalDocument.rows.getAt(0).get("number"));
        expect(copiedDocument.rows.getAt(0).get("bool")).toBe(originalDocument.rows.getAt(0).get("bool"));
        expect(copiedDocument.rows.getAt(0).get("enumSet")).toEqual(originalDocument.rows.getAt(0).get("enumSet"));
        expect(copiedDocument.rows.getAt(1).get("code")).toBe(originalDocument.rows.getAt(1).get("code"));
        expect(copiedDocument.rows.getAt(1).get("federalState")).toBe(originalDocument.rows.getAt(1).get("federalState"));
        expect(copiedDocument.rows.getAt(1).get("bool")).toBe(originalDocument.rows.getAt(1).get("bool"));
        expect(copiedDocument.rows.getAt(1).get("enumSet")).toEqual(originalDocument.rows.getAt(1).get("enumSet"));
    });

    it("Meta_Test", async () => {
        const originalDocument = CodeListDocument.parse(await DocumentFixture.loadAssetJson("codelist.meta.json"));

        const templateDocument = CodeListDocument.parse(await DocumentFixture.loadAssetJson("codelist.json"));
        const copiedDocument = await DocumentFixture.writeAndParseTempJson(
            "codelist.meta.copy.json",
            templateDocument.serializeMetaOnly({ pretty: true, indent: 2 }),
            CodeListDocument.parse
        );

        expect(originalDocument.metaOnly).toBe(true);
        expect(copiedDocument.metaOnly).toBe(true);
        expect(copiedDocument.comments).toEqual(originalDocument.comments);
        expect(copiedDocument.annotation?.descriptions).toEqual(originalDocument.annotation?.descriptions);
        expect(copiedDocument.annotation?.appInfo).toEqual(originalDocument.annotation?.appInfo);
        expect(copiedDocument.identification).toEqual(originalDocument.identification);

        expect(copiedDocument.columns.count).toBe(originalDocument.columns.count);
        expect(copiedDocument.keys.count).toBe(originalDocument.keys.count);
        expect(copiedDocument.defaultKey?.id).toBe(originalDocument.defaultKey?.id);
        expect(copiedDocument.foreignKeys.count).toBe(originalDocument.foreignKeys.count);

        expect(originalDocument.rows.count).toBe(0);
        expect(copiedDocument.rows.count).toBe(0);
    });
});
