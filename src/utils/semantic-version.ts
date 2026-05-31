/**
 * Semantic version type, following closely https://semver.org
 */
export class SemanticVersion {
    /**
     * Creates a new SemanticVersion.
     *
     * @param major Major version part
     * @param minor Minor version part
     * @param patch Patch version part
     * @param preRelease Additional label for pre-release
     */
    constructor(
        public readonly major: number,
        public readonly minor: number,
        public readonly patch: number,
        public readonly preRelease: string | null = null
    ) { }

    static from(version: string): SemanticVersion {
        const parts = version.split("-");
        const versionNumbers = parts[0]!.split(".");

        const major = versionNumbers.length > 0 ? parseInt(versionNumbers[0]!, 10) : 0;
        const minor = versionNumbers.length > 1 ? parseInt(versionNumbers[1]!, 10) : 0;
        const patch = versionNumbers.length > 2 ? parseInt(versionNumbers[2]!, 10) : 0;
        const preRelease = parts.length > 1 ? parts[1] : null;

        return new SemanticVersion(major, minor, patch, preRelease);
    }

    compareTo(other: SemanticVersion): number {
        if (this.major !== other.major) {
            return this.major - other.major;
        }

        if (this.minor !== other.minor) {
            return this.minor - other.minor;
        }

        if (this.patch !== other.patch) {
            return this.patch - other.patch;
        }

        const thisPre = this.preRelease ?? "";
        const otherPre = other.preRelease ?? "";

        if (!thisPre && otherPre) {
            return 1;
        }

        if (thisPre && !otherPre) {
            return -1;
        }

        return thisPre.localeCompare(otherPre);
    }

    equals(other: SemanticVersion | null | undefined): boolean {
        return other != null && this.compareTo(other) === 0;
    }

    lt(other: SemanticVersion): boolean {
        return this.compareTo(other) < 0;
    }

    lte(other: SemanticVersion): boolean {
        return this.compareTo(other) <= 0;
    }

    gt(other: SemanticVersion): boolean {
        return this.compareTo(other) > 0;
    }

    gte(other: SemanticVersion): boolean {
        return this.compareTo(other) >= 0;
    }

    toString(): string {
        return this.preRelease
            ? `${this.major}.${this.minor}.${this.patch}-${this.preRelease}`
            : `${this.major}.${this.minor}.${this.patch}`;
    }
}
