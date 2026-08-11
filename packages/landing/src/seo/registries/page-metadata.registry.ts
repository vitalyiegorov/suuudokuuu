import { homePageMetadata } from '../../app/metadata';
import { boxLineReductionPageMetadata } from '../../app/techniques/box-line-reduction/metadata';
import { fullHousePageMetadata } from '../../app/techniques/full-house/metadata';
import { hiddenPairPageMetadata } from '../../app/techniques/hidden-pair/metadata';
import { hiddenQuadPageMetadata } from '../../app/techniques/hidden-quad/metadata';
import { hiddenSinglePageMetadata } from '../../app/techniques/hidden-single/metadata';
import { hiddenTriplePageMetadata } from '../../app/techniques/hidden-triple/metadata';
import { techniquesPageMetadata } from '../../app/techniques/metadata';
import { nakedPairPageMetadata } from '../../app/techniques/naked-pair/metadata';
import { nakedQuadPageMetadata } from '../../app/techniques/naked-quad/metadata';
import { nakedSinglePageMetadata } from '../../app/techniques/naked-single/metadata';
import { nakedTriplePageMetadata } from '../../app/techniques/naked-triple/metadata';
import { pointingPairPageMetadata } from '../../app/techniques/pointing-pair/metadata';
import { pointingTriplePageMetadata } from '../../app/techniques/pointing-triple/metadata';

import type { PageMetadataInterface } from '../interfaces/page-metadata.interface';

export const PAGE_METADATA_REGISTRY: PageMetadataInterface[] = [
    homePageMetadata,
    techniquesPageMetadata,
    fullHousePageMetadata,
    nakedSinglePageMetadata,
    hiddenSinglePageMetadata,
    pointingPairPageMetadata,
    pointingTriplePageMetadata,
    boxLineReductionPageMetadata,
    nakedPairPageMetadata,
    nakedTriplePageMetadata,
    nakedQuadPageMetadata,
    hiddenPairPageMetadata,
    hiddenTriplePageMetadata,
    hiddenQuadPageMetadata
];
