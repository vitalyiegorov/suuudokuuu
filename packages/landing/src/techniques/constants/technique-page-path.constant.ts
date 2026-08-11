import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { aicPageMetadata } from '../../app/techniques/aic/metadata';
import { boxLineReductionPageMetadata } from '../../app/techniques/box-line-reduction/metadata';
import { finnedSwordfishPageMetadata } from '../../app/techniques/finned-swordfish/metadata';
import { finnedXWingPageMetadata } from '../../app/techniques/finned-x-wing/metadata';
import { fullHousePageMetadata } from '../../app/techniques/full-house/metadata';
import { hiddenPairPageMetadata } from '../../app/techniques/hidden-pair/metadata';
import { hiddenQuadPageMetadata } from '../../app/techniques/hidden-quad/metadata';
import { hiddenSinglePageMetadata } from '../../app/techniques/hidden-single/metadata';
import { hiddenTriplePageMetadata } from '../../app/techniques/hidden-triple/metadata';
import { jellyfishPageMetadata } from '../../app/techniques/jellyfish/metadata';
import { techniquesPageMetadata } from '../../app/techniques/metadata';
import { nakedPairPageMetadata } from '../../app/techniques/naked-pair/metadata';
import { nakedQuadPageMetadata } from '../../app/techniques/naked-quad/metadata';
import { nakedSinglePageMetadata } from '../../app/techniques/naked-single/metadata';
import { nakedTriplePageMetadata } from '../../app/techniques/naked-triple/metadata';
import { pointingPairPageMetadata } from '../../app/techniques/pointing-pair/metadata';
import { pointingTriplePageMetadata } from '../../app/techniques/pointing-triple/metadata';
import { sashimiSwordfishPageMetadata } from '../../app/techniques/sashimi-swordfish/metadata';
import { sashimiXWingPageMetadata } from '../../app/techniques/sashimi-x-wing/metadata';
import { simpleColoringPageMetadata } from '../../app/techniques/simple-coloring/metadata';
import { swordfishPageMetadata } from '../../app/techniques/swordfish/metadata';
import { wWingPageMetadata } from '../../app/techniques/w-wing/metadata';
import { xChainPageMetadata } from '../../app/techniques/x-chain/metadata';
import { xWingPageMetadata } from '../../app/techniques/x-wing/metadata';
import { xyChainPageMetadata } from '../../app/techniques/xy-chain/metadata';
import { xyWingPageMetadata } from '../../app/techniques/xy-wing/metadata';
import { xyzWingPageMetadata } from '../../app/techniques/xyz-wing/metadata';

export const TECHNIQUE_PAGE_PATHS: Record<SolutionTechniqueEnum, string> = {
    [SolutionTechniqueEnum.Guess]: techniquesPageMetadata.path,
    [SolutionTechniqueEnum.FullHouse]: fullHousePageMetadata.path,
    [SolutionTechniqueEnum.NakedSingle]: nakedSinglePageMetadata.path,
    [SolutionTechniqueEnum.HiddenSingle]: hiddenSinglePageMetadata.path,
    [SolutionTechniqueEnum.PointingPair]: pointingPairPageMetadata.path,
    [SolutionTechniqueEnum.PointingTriple]: pointingTriplePageMetadata.path,
    [SolutionTechniqueEnum.BoxLineReduction]: boxLineReductionPageMetadata.path,
    [SolutionTechniqueEnum.NakedPair]: nakedPairPageMetadata.path,
    [SolutionTechniqueEnum.NakedTriple]: nakedTriplePageMetadata.path,
    [SolutionTechniqueEnum.NakedQuad]: nakedQuadPageMetadata.path,
    [SolutionTechniqueEnum.HiddenPair]: hiddenPairPageMetadata.path,
    [SolutionTechniqueEnum.HiddenTriple]: hiddenTriplePageMetadata.path,
    [SolutionTechniqueEnum.HiddenQuad]: hiddenQuadPageMetadata.path,
    [SolutionTechniqueEnum.XWing]: xWingPageMetadata.path,
    [SolutionTechniqueEnum.Swordfish]: swordfishPageMetadata.path,
    [SolutionTechniqueEnum.Jellyfish]: jellyfishPageMetadata.path,
    [SolutionTechniqueEnum.FinnedXWing]: finnedXWingPageMetadata.path,
    [SolutionTechniqueEnum.FinnedSwordfish]: finnedSwordfishPageMetadata.path,
    [SolutionTechniqueEnum.SashimiXWing]: sashimiXWingPageMetadata.path,
    [SolutionTechniqueEnum.SashimiSwordfish]: sashimiSwordfishPageMetadata.path,
    [SolutionTechniqueEnum.XYWing]: xyWingPageMetadata.path,
    [SolutionTechniqueEnum.XYZWing]: xyzWingPageMetadata.path,
    [SolutionTechniqueEnum.WWing]: wWingPageMetadata.path,
    [SolutionTechniqueEnum.XChain]: xChainPageMetadata.path,
    [SolutionTechniqueEnum.XYChain]: xyChainPageMetadata.path,
    [SolutionTechniqueEnum.SimpleColoring]: simpleColoringPageMetadata.path,
    [SolutionTechniqueEnum.AIC]: aicPageMetadata.path
};
