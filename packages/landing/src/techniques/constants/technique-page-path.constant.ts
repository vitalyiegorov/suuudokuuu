import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import { aicPageMetadata } from '../../app/(en)/techniques/aic/metadata';
import { boxLineReductionPageMetadata } from '../../app/(en)/techniques/box-line-reduction/metadata';
import { bugPageMetadata } from '../../app/(en)/techniques/bug/metadata';
import { cellForcingChainPageMetadata } from '../../app/(en)/techniques/cell-forcing-chain/metadata';
import { finnedSwordfishPageMetadata } from '../../app/(en)/techniques/finned-swordfish/metadata';
import { finnedXWingPageMetadata } from '../../app/(en)/techniques/finned-x-wing/metadata';
import { fullHousePageMetadata } from '../../app/(en)/techniques/full-house/metadata';
import { hiddenPairPageMetadata } from '../../app/(en)/techniques/hidden-pair/metadata';
import { hiddenQuadPageMetadata } from '../../app/(en)/techniques/hidden-quad/metadata';
import { hiddenSinglePageMetadata } from '../../app/(en)/techniques/hidden-single/metadata';
import { hiddenTriplePageMetadata } from '../../app/(en)/techniques/hidden-triple/metadata';
import { jellyfishPageMetadata } from '../../app/(en)/techniques/jellyfish/metadata';
import { techniquesPageMetadata } from '../../app/(en)/techniques/metadata';
import { nakedPairPageMetadata } from '../../app/(en)/techniques/naked-pair/metadata';
import { nakedQuadPageMetadata } from '../../app/(en)/techniques/naked-quad/metadata';
import { nakedSinglePageMetadata } from '../../app/(en)/techniques/naked-single/metadata';
import { nakedTriplePageMetadata } from '../../app/(en)/techniques/naked-triple/metadata';
import { nishioForcingChainPageMetadata } from '../../app/(en)/techniques/nishio-forcing-chain/metadata';
import { pointingPairPageMetadata } from '../../app/(en)/techniques/pointing-pair/metadata';
import { pointingTriplePageMetadata } from '../../app/(en)/techniques/pointing-triple/metadata';
import { regionForcingChainPageMetadata } from '../../app/(en)/techniques/region-forcing-chain/metadata';
import { sashimiSwordfishPageMetadata } from '../../app/(en)/techniques/sashimi-swordfish/metadata';
import { sashimiXWingPageMetadata } from '../../app/(en)/techniques/sashimi-x-wing/metadata';
import { simpleColoringPageMetadata } from '../../app/(en)/techniques/simple-coloring/metadata';
import { swordfishPageMetadata } from '../../app/(en)/techniques/swordfish/metadata';
import { uniqueRectanglePageMetadata } from '../../app/(en)/techniques/unique-rectangle/metadata';
import { wWingPageMetadata } from '../../app/(en)/techniques/w-wing/metadata';
import { xChainPageMetadata } from '../../app/(en)/techniques/x-chain/metadata';
import { xWingPageMetadata } from '../../app/(en)/techniques/x-wing/metadata';
import { xyChainPageMetadata } from '../../app/(en)/techniques/xy-chain/metadata';
import { xyWingPageMetadata } from '../../app/(en)/techniques/xy-wing/metadata';
import { xyzWingPageMetadata } from '../../app/(en)/techniques/xyz-wing/metadata';

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
    [SolutionTechniqueEnum.AIC]: aicPageMetadata.path,
    [SolutionTechniqueEnum.UniqueRectangle]: uniqueRectanglePageMetadata.path,
    [SolutionTechniqueEnum.BivalueUniversalGrave]: bugPageMetadata.path,
    [SolutionTechniqueEnum.NishioForcingChain]: nishioForcingChainPageMetadata.path,
    [SolutionTechniqueEnum.CellForcingChain]: cellForcingChainPageMetadata.path,
    [SolutionTechniqueEnum.RegionForcingChain]: regionForcingChainPageMetadata.path
};
