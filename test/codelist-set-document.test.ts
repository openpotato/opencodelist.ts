import { describe, expect, it } from "vitest";

import { CodeListDocumentRef } from "../src/models/code-list-document-ref.js";
import { CodeListSetDocument } from "../src/code-list-set-document.js";
import { DocumentFixture } from "./document-fixture.js";

describe("CodeListSetDocument", () => {
    it("Read_Test", async () => {
        const document = CodeListSetDocument.parse(await DocumentFixture.loadAssetJson("codelistset.json"));

        expect(document).toBeDefined();
        expect(document.metaOnly).toBe(false);
        expect(document.comments[0]).toBe("This is a comment.");
        expect(document.annotation?.descriptions[0]?.format).toBe("markdown");
        expect(document.annotation?.descriptions[0]?.language).toBe("de");
        expect(document.annotation?.descriptions[0]?.content).toBe("Das ist eine **Anmerkung**.");
        expect(document.identification.shortName).toBe("TestCodeListSet");
        expect(document.identification.longName).toBe("A test code list set");
        expect(document.identification.publisher?.shortName).toBe("OpenPotato");
        expect(document.identification.publisher?.longName).toBe("The OpenPotato Project");
        expect(document.identification.publisher?.identifier?.source?.shortName).toBe("TrustMe");
        expect(document.identification.publisher?.identifier?.value).toBe("42");
        expect(document.documentRefs.getAt(0)).toBeInstanceOf(CodeListDocumentRef);
    });

    it("Write_Test", async () => {
        const originalDocument = CodeListSetDocument.parse(await DocumentFixture.loadAssetJson("codelistset.json"));
        const copiedDocument = await DocumentFixture.writeAndParseTempJson(
            "codelistset.copy.json",
            originalDocument.serialize(false, { pretty: true, indent: 2 }),
            CodeListSetDocument.parse
        );

        expect(originalDocument.metaOnly).toBe(false);
        expect(copiedDocument.comments).toEqual(originalDocument.comments);
        expect(copiedDocument.annotation?.descriptions).toEqual(originalDocument.annotation?.descriptions);
        expect(copiedDocument.annotation?.appInfo).toEqual(originalDocument.annotation?.appInfo);
        expect(copiedDocument.identification).toEqual(originalDocument.identification);
        expect(copiedDocument.documentRefs.count).toBe(originalDocument.documentRefs.count);
        expect(copiedDocument.documentRefs.getAt(0).toJSON()).toEqual(originalDocument.documentRefs.getAt(0).toJSON());
    });
});
