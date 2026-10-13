import * as Schema from 'effect/Schema';

const VersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/u;
const BranchPattern = /^[A-Za-z0-9][\w./-]*$/u;
const MaximumBranchLength = 255;
const CommitShaPattern = /^[0-9a-f]{40}$/u;
const CommitShortShaPattern = /^[0-9a-f]{7}$/u;
const ChecksumPattern = /^[0-9a-f]{64}$/u;
const TagNamePattern = /^development-[1-9]\d*-[1-9]\d*-[1-9]\d*$/u;
const WorkflowUrlPattern = /^https:\/\/github\.com\/vitalyiegorov\/suuudokuuu\/actions\/runs\/[1-9]\d*$/u;

const Timestamp = Schema.String.check(
    Schema.makeFilter(
        value =>
            /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+)?Z$/u.test(value) &&
            Number.isFinite(Date.parse(value)) &&
            new Date(value).toISOString().slice(0, 10) === value.slice(0, 10)
    )
);

export const BetaReleaseSchema = Schema.Struct({
    branch: Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(MaximumBranchLength), Schema.isPattern(BranchPattern)),
    builtAt: Timestamp,
    checksums: Schema.Struct({
        apk: Schema.String.check(Schema.isPattern(ChecksumPattern)),
        ipa: Schema.String.check(Schema.isPattern(ChecksumPattern))
    }),
    commitSha: Schema.String.check(Schema.isPattern(CommitShaPattern)),
    commitShortSha: Schema.String.check(Schema.isPattern(CommitShortShaPattern)),
    installUrls: Schema.Struct({
        android: Schema.Literal('/api/beta/apk'),
        iosManifest: Schema.Literal('/ota/manifest.plist')
    }),
    name: Schema.String.check(Schema.isMinLength(1)),
    publishedAt: Timestamp,
    releaseNotes: Schema.String,
    runNumber: Schema.Int.check(Schema.isGreaterThan(0)),
    tagName: Schema.String.check(Schema.isPattern(TagNamePattern)),
    version: Schema.String.check(Schema.isPattern(VersionPattern)),
    workflowUrl: Schema.String.check(Schema.isPattern(WorkflowUrlPattern))
}).check(
    Schema.makeFilter(
        release =>
            release.commitShortSha === release.commitSha.slice(0, 7) && release.tagName.startsWith(`development-${release.runNumber}-`)
    )
);

export type BetaRelease = typeof BetaReleaseSchema.Type;
