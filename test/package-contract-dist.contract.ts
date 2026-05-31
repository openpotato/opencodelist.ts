import { describe, expect, it } from "vitest";

describe("Package contract (dist)", () => {
    it("loads package root from dist output", async () => {
        const pkg = await import("../dist/index.js");

        expect(pkg).toBeDefined();
        expect(pkg.CodeListDocument).toBeDefined();
        expect(pkg.CodeListSetDocument).toBeDefined();
        expect(pkg.DocumentLoader).toBeDefined();
        expect(pkg.CodeListParserError).toBeDefined();
        expect(pkg.Document).toBeDefined();
        expect(pkg.SemanticVersion).toBeDefined();
    });

    it("loads models and dictionaries subpath outputs", async () => {
        const models = await import("../dist/models/index.js");
        const dictionaries = await import("../dist/dictionaries/index.js");

        expect(models).toBeDefined();
        expect(models.Row).toBeDefined();
        expect(dictionaries).toBeDefined();
        expect(dictionaries.PropertyNames).toBeDefined();
        expect(dictionaries.TypeConsts).toBeDefined();
    });
});
