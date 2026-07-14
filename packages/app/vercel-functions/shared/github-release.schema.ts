import { z } from 'zod';

const githubReleaseAssetSchema = z.object({
    browser_download_url: z.string(),
    name: z.string(),
    size: z.number()
});

export const githubReleaseSchema = z.object({
    assets: z.array(githubReleaseAssetSchema),
    body: z.string().nullable(),
    draft: z.boolean(),
    name: z.string().nullable(),
    prerelease: z.boolean(),
    published_at: z.iso.datetime({ offset: false }).nullable(),
    tag_name: z.string()
});

export const githubReleasesSchema = z.array(z.unknown());

export type GithubRelease = z.infer<typeof githubReleaseSchema>;
export type GithubReleaseAsset = z.infer<typeof githubReleaseAssetSchema>;
