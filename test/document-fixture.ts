import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export class DocumentFixture {
    static getOutputFolder(): string {
        return process.cwd();
    }

    static getAssetsFolder(): string {
        return path.join(this.getOutputFolder(), "test", "assets");
    }

    static getAssetPath(fileName: string): string {
        return path.join(this.getAssetsFolder(), fileName);
    }

    static async loadAssetText(fileName: string): Promise<string> {
        return readFile(this.getAssetPath(fileName), "utf8");
    }

    static async loadAssetJson(fileName: string): Promise<Record<string, unknown>> {
        return JSON.parse(await this.loadAssetText(fileName)) as Record<string, unknown>;
    }

    static async withTempDir<T>(action: (workDir: string) => Promise<T>): Promise<T> {
        const workDir = await mkdtemp(path.join(tmpdir(), "opencodelist-ts-"));

        try {
            return await action(workDir);
        } finally {
            await rm(workDir, { recursive: true, force: true });
        }
    }

    static async writeAndParseTempJson<T>(
        fileName: string,
        jsonText: string,
        parser: (json: Record<string, unknown>) => T
    ): Promise<T> {
        return this.withTempDir(async (workDir) => {
            const copyPath = path.join(workDir, fileName);
            await writeFile(copyPath, jsonText, "utf8");
            const copiedText = await readFile(copyPath, "utf8");
            return parser(JSON.parse(copiedText) as Record<string, unknown>);
        });
    }
}
