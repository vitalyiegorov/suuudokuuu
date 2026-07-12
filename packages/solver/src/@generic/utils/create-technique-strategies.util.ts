import { AICTechnique } from '../../aic-technique/classes/aic.technique';
import { BasicFishTechnique } from '../../basic-fish-technique/classes/basic-fish.technique';
import { BoxLineReductionTechnique } from '../../box-line-reduction-technique/classes/box-line-reduction.technique';
import { FinnedFishTechnique } from '../../finned-fish-technique/classes/finned-fish.technique';
import { FullHouseTechnique } from '../../full-house-technique/classes/full-house.technique';
import { HiddenSingleTechnique } from '../../hidden-single-technique/classes/hidden-single.technique';
import { HiddenSubsetTechnique } from '../../hidden-subset-technique/classes/hidden-subset.technique';
import { NakedSingleTechnique } from '../../naked-single-technique/classes/naked-single.technique';
import { NakedSubsetTechnique } from '../../naked-subset-technique/classes/naked-subset.technique';
import { PointingTechnique } from '../../pointing-technique/classes/pointing.technique';
import { SimpleColoringTechnique } from '../../simple-coloring-technique/classes/simple-coloring.technique';
import { WWingTechnique } from '../../w-wing-technique/classes/w-wing.technique';
import { XChainTechnique } from '../../x-chain-technique/classes/x-chain.technique';
import { XYChainTechnique } from '../../xy-chain-technique/classes/xy-chain.technique';
import { XYWingTechnique } from '../../xy-wing-technique/classes/xy-wing.technique';
import { XYZWingTechnique } from '../../xyz-wing-technique/classes/xyz-wing.technique';
import { SolutionTechniqueEnum } from '../enums/solution-technique.enum';

import type { TechniqueStrategyInterface } from '../interfaces/technique-strategy.interface';

export const createTechniqueStrategies = (): TechniqueStrategyInterface[] => [
    new FullHouseTechnique(),
    new NakedSingleTechnique(),
    new HiddenSingleTechnique(),
    new PointingTechnique({ technique: SolutionTechniqueEnum.PointingPair, size: 2 }),
    new PointingTechnique({ technique: SolutionTechniqueEnum.PointingTriple, size: 3 }),
    new BoxLineReductionTechnique(),
    new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedPair, size: 2 }),
    new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedTriple, size: 3 }),
    new NakedSubsetTechnique({ technique: SolutionTechniqueEnum.NakedQuad, size: 4 }),
    new HiddenSubsetTechnique({ technique: SolutionTechniqueEnum.HiddenPair, size: 2 }),
    new HiddenSubsetTechnique({ technique: SolutionTechniqueEnum.HiddenTriple, size: 3 }),
    new HiddenSubsetTechnique({ technique: SolutionTechniqueEnum.HiddenQuad, size: 4 }),
    new BasicFishTechnique({ technique: SolutionTechniqueEnum.XWing, size: 2 }),
    new BasicFishTechnique({ technique: SolutionTechniqueEnum.Swordfish, size: 3 }),
    new BasicFishTechnique({ technique: SolutionTechniqueEnum.Jellyfish, size: 4 }),
    new FinnedFishTechnique({ technique: SolutionTechniqueEnum.FinnedXWing, size: 2, sashimi: false }),
    new FinnedFishTechnique({ technique: SolutionTechniqueEnum.FinnedSwordfish, size: 3, sashimi: false }),
    new FinnedFishTechnique({ technique: SolutionTechniqueEnum.SashimiXWing, size: 2, sashimi: true }),
    new FinnedFishTechnique({ technique: SolutionTechniqueEnum.SashimiSwordfish, size: 3, sashimi: true }),
    new XYWingTechnique(),
    new XYZWingTechnique(),
    new WWingTechnique(),
    new XChainTechnique(),
    new XYChainTechnique(),
    new SimpleColoringTechnique(),
    new AICTechnique()
];
