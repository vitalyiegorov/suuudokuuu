import { z } from 'zod';

import { DevelopmentWorkflowUrlPrefix } from './beta-release.constant';

const BranchPattern = /^[A-Za-z0-9][A-Za-z0-9._/-]*$/u;
const MaximumBranchLength = 255;
const CommitShaPattern = /^[a-f0-9]{40}$/u;
const VersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;

export const releaseMetadataSchema = z
    .object({
        branch: z.string().min(1).max(MaximumBranchLength).regex(BranchPattern),
        builtAt: z.iso.datetime({ offset: false }),
        commitSha: z.string().regex(CommitShaPattern),
        runNumber: z.number().int().positive(),
        version: z.string().regex(VersionPattern),
        workflowUrl: z.url()
    })
    .strict()
    .refine(metadata => metadata.workflowUrl === `${DevelopmentWorkflowUrlPrefix}${metadata.runNumber}`);
