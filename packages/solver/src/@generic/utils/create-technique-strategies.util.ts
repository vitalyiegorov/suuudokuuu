import { BoxLineReductionTechnique } from '../../box-line-reduction-technique/classes/box-line-reduction.technique';
import { FinnedSwordfishTechnique } from '../../finned-swordfish-technique/classes/finned-swordfish.technique';
import { FinnedXWingTechnique } from '../../finned-x-wing-technique/classes/finned-x-wing.technique';
import { FullHouseTechnique } from '../../full-house-technique/classes/full-house.technique';
import { HiddenPairTechnique } from '../../hidden-pair-technique/classes/hidden-pair.technique';
import { HiddenQuadTechnique } from '../../hidden-quad-technique/classes/hidden-quad.technique';
import { HiddenSingleTechnique } from '../../hidden-single-technique/classes/hidden-single.technique';
import { HiddenTripleTechnique } from '../../hidden-triple-technique/classes/hidden-triple.technique';
import { JellyfishTechnique } from '../../jellyfish-technique/classes/jellyfish.technique';
import { NakedPairTechnique } from '../../naked-pair-technique/classes/naked-pair.technique';
import { NakedQuadTechnique } from '../../naked-quad-technique/classes/naked-quad.technique';
import { NakedSingleTechnique } from '../../naked-single-technique/classes/naked-single.technique';
import { NakedTripleTechnique } from '../../naked-triple-technique/classes/naked-triple.technique';
import { PointingPairTechnique } from '../../pointing-pair-technique/classes/pointing-pair.technique';
import { PointingTripleTechnique } from '../../pointing-triple-technique/classes/pointing-triple.technique';
import { SashimiSwordfishTechnique } from '../../sashimi-swordfish-technique/classes/sashimi-swordfish.technique';
import { SashimiXWingTechnique } from '../../sashimi-x-wing-technique/classes/sashimi-x-wing.technique';
import { SwordfishTechnique } from '../../swordfish-technique/classes/swordfish.technique';
import { WWingTechnique } from '../../w-wing-technique/classes/w-wing.technique';
import { XChainTechnique } from '../../x-chain-technique/classes/x-chain.technique';
import { XWingTechnique } from '../../x-wing-technique/classes/x-wing.technique';
import { XYChainTechnique } from '../../xy-chain-technique/classes/xy-chain.technique';
import { XYWingTechnique } from '../../xy-wing-technique/classes/xy-wing.technique';
import { XYZWingTechnique } from '../../xyz-wing-technique/classes/xyz-wing.technique';

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
