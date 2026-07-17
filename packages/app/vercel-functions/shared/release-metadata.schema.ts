import { z } from 'zod';

const BranchPattern = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/u;
const MaximumBranchLength = 255;
const BundleVersionPattern = /^[1-9]\d*(?:\.[1-9]\d*){0,2}$/u;
const CommitShaPattern = /^[a-f0-9]{40}$/u;
const VersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;
const WorkflowUrlPattern = /^https:\/\/github\.com\/vitalyiegorov\/suuudokuuu\/actions\/runs\/[1-9]\d*$/u;

export const releaseMetadataSchema = z
    .object({
        branch: z.string().min(1).max(MaximumBranchLength).regex(BranchPattern),
        bundleVersion: z.string().regex(BundleVersionPattern),
        builtAt: z.iso.datetime({ offset: false }),
        commitSha: z.string().regex(CommitShaPattern),
        version: z.string().regex(VersionPattern),
        workflowUrl: z.string().regex(WorkflowUrlPattern)
    })
    .strict();
