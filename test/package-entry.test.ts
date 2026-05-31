import { describe, expect, it } from "vitest";

import {
    CodeListDocument,
    CodeListSetDocument,
    CodeListParserError,
    Document,
    DocumentLoader,
    SemanticVersion,
} from "../src/index.js";

describe("Package entry exports", () => {
    it("exports the expected public API", () => {
        expect(CodeListDocument).toBeDefined();
        expect(CodeListSetDocument).toBeDefined();
        expect(CodeListParserError).toBeDefined();
        expect(DocumentLoader).toBeDefined();
        expect(Document).toBeDefined();
        expect(SemanticVersion).toBeDefined();
    });
});
