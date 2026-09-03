import { describe, expect, it } from "vitest";

import { CodeListBase } from "../src/code-list-base.js";

describe("OpenCodeList version compatibility", () => {
    it("accepts every patch version in the implemented feature set", () => {
        expect(CodeListBase.supportedVersionRange.test("0.4.0")).toBe(true);
        expect(CodeListBase.supportedVersionRange.test("0.4.1")).toBe(true);
        expect(CodeListBase.supportedVersionRange.test("0.4.123")).toBe(true);
    });

    it("rejects other feature sets and non-spec version forms", () => {
        expect(CodeListBase.supportedVersionRange.test("0.3.99")).toBe(false);
        expect(CodeListBase.supportedVersionRange.test("0.5.0")).toBe(false);
        expect(CodeListBase.supportedVersionRange.test("0.4")).toBe(false);
        expect(CodeListBase.supportedVersionRange.test("0.4.01")).toBe(false);
        expect(CodeListBase.supportedVersionRange.test("0.4.0-beta.1")).toBe(false);
    });
});
