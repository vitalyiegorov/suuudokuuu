import { BoxLineReductionTechnique } from '../classes/techniques/box-line-reduction-technique/box-line-reduction.technique';
import { FinnedSwordfishTechnique } from '../classes/techniques/finned-swordfish-technique/finned-swordfish.technique';
import { FinnedXWingTechnique } from '../classes/techniques/finned-x-wing-technique/finned-x-wing.technique';
import { FullHouseTechnique } from '../classes/techniques/full-house-technique/full-house.technique';
import { HiddenPairTechnique } from '../classes/techniques/hidden-pair-technique/hidden-pair.technique';
import { HiddenQuadTechnique } from '../classes/techniques/hidden-quad-technique/hidden-quad.technique';
import { HiddenSingleTechnique } from '../classes/techniques/hidden-single-technique/hidden-single.technique';
import { HiddenTripleTechnique } from '../classes/techniques/hidden-triple-technique/hidden-triple.technique';
import { JellyfishTechnique } from '../classes/techniques/jellyfish-technique/jellyfish.technique';
import { NakedPairTechnique } from '../classes/techniques/naked-pair-technique/naked-pair.technique';
import { NakedQuadTechnique } from '../classes/techniques/naked-quad-technique/naked-quad.technique';
import { NakedSingleTechnique } from '../classes/techniques/naked-single-technique/naked-single.technique';
import { NakedTripleTechnique } from '../classes/techniques/naked-triple-technique/naked-triple.technique';
import { PointingPairTechnique } from '../classes/techniques/pointing-pair-technique/pointing-pair.technique';
import { PointingTripleTechnique } from '../classes/techniques/pointing-triple-technique/pointing-triple.technique';
import { SashimiSwordfishTechnique } from '../classes/techniques/sashimi-swordfish-technique/sashimi-swordfish.technique';
import { SashimiXWingTechnique } from '../classes/techniques/sashimi-x-wing-technique/sashimi-x-wing.technique';
import { SwordfishTechnique } from '../classes/techniques/swordfish-technique/swordfish.technique';
import { WWingTechnique } from '../classes/techniques/w-wing-technique/w-wing.technique';
import { XChainTechnique } from '../classes/techniques/x-chain-technique/x-chain.technique';
import { XWingTechnique } from '../classes/techniques/x-wing-technique/x-wing.technique';
import { XYChainTechnique } from '../classes/techniques/xy-chain-technique/xy-chain.technique';
import { XYWingTechnique } from '../classes/techniques/xy-wing-technique/xy-wing.technique';
import { XYZWingTechnique } from '../classes/techniques/xyz-wing-technique/xyz-wing.technique';

import type { TechniqueStrategyInterface } from '../interfaces/technique-strategy.interface';

export const createTechniqueStrategies = (): TechniqueStrategyInterface[] => [
    new FullHouseTechnique(),
    new NakedSingleTechnique(),
    new HiddenSingleTechnique(),
    new PointingPairTechnique(),
    new PointingTripleTechnique(),
    new BoxLineReductionTechnique(),
    new NakedPairTechnique(),
    new NakedTripleTechnique(),
    new NakedQuadTechnique(),
    new HiddenPairTechnique(),
    new HiddenTripleTechnique(),
    new HiddenQuadTechnique(),
    new XWingTechnique(),
    new SwordfishTechnique(),
    new JellyfishTechnique(),
    new FinnedXWingTechnique(),
    new FinnedSwordfishTechnique(),
    new SashimiXWingTechnique(),
    new SashimiSwordfishTechnique(),
    new XYWingTechnique(),
    new XYZWingTechnique(),
    new WWingTechnique(),
    new XChainTechnique(),
    new XYChainTechnique()
];
