export interface ReleaseChecksums {
    readonly apk: string;
    readonly ipa: string;
}

interface ReleaseMetadata {
    readonly branch: string;
    readonly bundleVersion: string;
    readonly builtAt: string;
    readonly commitSha: string;
    readonly version: string;
    readonly workflowUrl: string;
}

export interface ParsedReleaseMetadata {
    readonly metadata: ReleaseMetadata;
    readonly releaseNotes: string;
}

export interface BetaReleaseCandidate extends ReleaseMetadata {
    readonly apkUrl: string;
    readonly checksumsUrl: string;
    readonly ipaUrl: string;
    readonly name: string;
    readonly publishedAt: string;
    readonly releaseNotes: string;
    readonly runNumber: number;
    readonly tagName: string;
}

export interface BetaRelease extends ReleaseMetadata {
    readonly apkUrl: string;
    readonly checksums: ReleaseChecksums;
    readonly ipaUrl: string;
    readonly name: string;
    readonly publishedAt: string;
    readonly releaseNotes: string;
    readonly runNumber: number;
    readonly tagName: string;
}

export type ResolveBetaReleaseResult =
    | { readonly status: 'ready'; readonly release: BetaRelease }
    | { readonly status: 'not-found' }
    | { readonly status: 'upstream-failure' };

export interface ResolveBetaReleaseDependencies {
    readonly fetch: typeof fetch;
    readonly githubToken?: string;
}
