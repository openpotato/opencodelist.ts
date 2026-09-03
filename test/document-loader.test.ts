import { describe, expect, it } from "vitest";

import { CodeListDocument } from "../src/code-list-document.js";
import { CodeListSetDocument } from "../src/code-list-set-document.js";
import { DocumentFixture } from "./document-fixture.js";
import { CodeListLoader } from "../src/code-list-loader.js";

describe("CodeListLoader", () => {
    it.each([
        ["Read_CodeList", "codelist.json", CodeListDocument],
        ["Read_CodeListSet", "codelistset.json", CodeListSetDocument],
    ])("%s", async (_, fileName, expectedType) => {
        const jsonText = await DocumentFixture.loadAssetText(fileName);

        const document = CodeListLoader.load(jsonText);

        expect(document).toBeDefined();
        expect(document).toBeInstanceOf(expectedType);
    });
});
