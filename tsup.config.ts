import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["esm", "cjs"],
        dts: true,
        sourcemap: true,
        splitting: false,
        clean: true,
        target: "es2022",
    },
    {
        entry: ["src/models/index.ts"],
        format: ["esm", "cjs"],
        outDir: "dist/models",
        dts: true,
        sourcemap: true,
        splitting: false,
        clean: false,
        target: "es2022",
    },
    {
        entry: ["src/dictionaries/index.ts"],
        format: ["esm", "cjs"],
        outDir: "dist/dictionaries",
        dts: true,
        sourcemap: true,
        splitting: false,
        clean: false,
        target: "es2022",
    }
]);
