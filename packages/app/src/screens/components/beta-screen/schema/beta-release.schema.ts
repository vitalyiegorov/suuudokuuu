import { z } from 'zod';

const VersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;
const BranchPattern = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/u;
const MaximumBranchLength = 255;
const CommitShaPattern = /^[0-9a-f]{40}$/u;
const CommitShortShaPattern = /^[0-9a-f]{7}$/u;
const ChecksumPattern = /^[0-9a-f]{64}$/u;
const TagNamePattern = /^development-[1-9]\d*-[1-9]\d*-[1-9]\d*$/u;
const WorkflowUrlPattern = /^https:\/\/github\.com\/vitalyiegorov\/suuudokuuu\/actions\/runs\/[1-9]\d*$/u;

export const BetaReleaseSchema = z
    .strictObject({
        branch: z.string().min(1).max(MaximumBranchLength).regex(BranchPattern),
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
        version: z.string().regex(VersionPattern),
        workflowUrl: z.string().regex(WorkflowUrlPattern)
    })
    .superRefine((release, context) => {
        if (release.commitShortSha !== release.commitSha.slice(0, 7)) {
            context.addIssue({ code: 'custom', path: ['commitShortSha'] });
        }

        if (!release.tagName.startsWith(`development-${release.runNumber}-`)) {
            context.addIssue({ code: 'custom', path: ['tagName'] });
        }
    });

export type BetaRelease = z.infer<typeof BetaReleaseSchema>;
