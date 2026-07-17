import { DevelopmentMetadataMarkerPrefix } from './beta-release.constant';
import { releaseMetadataSchema } from './release-metadata.schema';

import type { ParsedReleaseMetadata } from './beta-release.interface';

const MetadataMarkerPattern = /^<!-- suuudokuuu-development-metadata (.+?) -->/u;

const parseMetadataJson = (metadataJson: string) => {
    try {
        const metadataInput: unknown = JSON.parse(metadataJson);
        const metadataResult = releaseMetadataSchema.safeParse(metadataInput);

        return metadataResult.success ? metadataResult.data : null;
    } catch {
        return null;
    }
};

export const parseReleaseMetadata = (releaseBody: string): ParsedReleaseMetadata | null => {
    const markerOccurrences = releaseBody.split(DevelopmentMetadataMarkerPrefix).length - 1;
    const markerMatch = MetadataMarkerPattern.exec(releaseBody);
    const completeMarker = markerMatch?.at(0) ?? null;
    const metadataJson = markerMatch?.at(1) ?? null;
    if (markerOccurrences !== 1 || completeMarker === null || metadataJson === null) {
        return null;
    }

    const metadata = parseMetadataJson(metadataJson);
    if (metadata === null) {
        return null;
    }

    return {
        metadata,
        releaseNotes: releaseBody.slice(completeMarker.length).trim()
    };
};
