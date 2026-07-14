import { z } from 'zod';

const SemverPattern =
    /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/u;
const CommitShaPattern = /^[0-9a-f]{40}$/u;
const CommitShortShaPattern = /^[0-9a-f]{7}$/u;
const ChecksumPattern = /^[0-9a-f]{64}$/u;
const TagNamePattern = /^development-[1-9]\d*$/u;
const WorkflowUrlPattern = /^https:\/\/github\.com\/vitalyiegorov\/suuudokuuu\/actions\/runs\/[1-9]\d*$/u;

export const BetaReleaseSchema = z
    .strictObject({
        branch: z.string().min(1),
        builtAt: z.iso.datetime(),
        checksums: z.strictObject({
            apk: z.string().regex(ChecksumPattern),
            ipa: z.string().regex(ChecksumPattern)
        }),
        commitSha: z.string().regex(CommitShaPattern),
        commitShortSha: z.string().regex(CommitShortShaPattern),
        installUrls: z.strictObject({
            android: z.literal('/api/beta/apk'),
            iosManifest: z.literal('/ota/manifest.plist')
        }),
        name: z.string().min(1),
        publishedAt: z.iso.datetime(),
        releaseNotes: z.string(),
        runNumber: z.number().int().positive(),
        tagName: z.string().regex(TagNamePattern),
        version: z.string().regex(SemverPattern),
        workflowUrl: z.string().regex(WorkflowUrlPattern)
    })
    .superRefine((release, context) => {
        if (release.commitShortSha !== release.commitSha.slice(0, 7)) {
            context.addIssue({ code: 'custom', path: ['commitShortSha'] });
        }

        if (release.tagName !== `development-${release.runNumber}`) {
            context.addIssue({ code: 'custom', path: ['tagName'] });
        }
    });

export type BetaRelease = z.infer<typeof BetaReleaseSchema>;
