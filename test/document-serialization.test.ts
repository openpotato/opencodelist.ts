import { describe, expect, it } from "vitest";

import { CodeListDocument } from "../src/code-list-document.js";
import { DocumentFixture } from "./document-fixture.js";

describe("Document serialization options", () => {
    it("serialize supports compact output", async () => {
        const document = CodeListDocument.parse(await DocumentFixture.loadAssetJson("codelist.meta.json"));

        const json = document.serialize(true, { pretty: false });

        expect(json).not.toContain("\n");
        expect(json).toContain("\"$opencodelist\"");
    });

    it("serialize supports custom indentation", async () => {
        const document = CodeListDocument.parse(await DocumentFixture.loadAssetJson("codelist.meta.json"));

        const json = document.serialize(true, { pretty: true, indent: 4 });

        expect(json).toContain("\n    \"$opencodelist\"");
    });

    it("serializeMetaOnly forwards serialization options", async () => {
        const document = CodeListDocument.parse(await DocumentFixture.loadAssetJson("codelist.json"));

        const json = document.serializeMetaOnly({ pretty: false });

        expect(json).not.toContain("\n");
        expect(json).toContain("\"codeList\"");
        expect(json).not.toContain("\"dataSet\"");
    });
});
