import { describe, expect, it } from "vitest";

import {
    CodeListDocument,
    CodeListSetDocument,
    CodeListParserError,
    CodeListBase,
    CodeListLoader,
} from "../src/index.js";

describe("Package entry exports", () => {
    it("exports the expected public API", () => {
        expect(CodeListDocument).toBeDefined();
        expect(CodeListSetDocument).toBeDefined();
        expect(CodeListParserError).toBeDefined();
        expect(CodeListLoader).toBeDefined();
        expect(CodeListBase).toBeDefined();
    });
});
