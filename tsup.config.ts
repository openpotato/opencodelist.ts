import { defineConfig } from "tsup";

export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["esm", "cjs"],
        sourcemap: true,
        splitting: false,
        clean: true,
        target: "es2022",
        dts: {
            compilerOptions: {
                ignoreDeprecations: '6.0',
            },
        },
    },
    {
        entry: ["src/models/index.ts"],
        format: ["esm", "cjs"],
        outDir: "dist/models",
        sourcemap: true,
        splitting: false,
        clean: false,
        target: "es2022",
        dts: {
            compilerOptions: {
                ignoreDeprecations: '6.0',
            },
        },
    },
    {
        entry: ["src/dictionaries/index.ts"],
        format: ["esm", "cjs"],
        outDir: "dist/dictionaries",
        sourcemap: true,
        splitting: false,
        clean: false,
        target: "es2022",
        dts: {
            compilerOptions: {
                ignoreDeprecations: '6.0',
            },
        },
    }
]);
