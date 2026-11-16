import { GridRecognitionKindEnum, recognizeGrid } from '@suuudokuuu/grid-vision';
import * as Effect from 'effect/Effect';

import { LoaderPaintDelayMillisecondsConstant } from '../../../../game/constant/loader-paint-delay.constant';
import { PuzzleGenerationService } from '../../../../game/service/puzzle-generation.service';

import { importScreenOpenImage } from './import-screen-open-image.util';

import type { GridRegionInterface } from '@suuudokuuu/grid-vision';

const MaxReadSide = 768;
const UncertainConfidence = 0.9;
const WholeImageRegion = { x: 0, y: 0, width: 1, height: 1 };

const readRegion = (source: Effect.Success<ReturnType<typeof importScreenOpenImage>>, region: GridRegionInterface) => {
    const originX = Math.min(source.width - 1, Math.floor(region.x * source.width));
    const originY = Math.min(source.height - 1, Math.floor(region.y * source.height));
    const width = Math.max(1, Math.min(source.width - originX, Math.ceil(region.width * source.width)));
    const height = Math.max(1, Math.min(source.height - originY, Math.ceil(region.height * source.height)));

    return source.read({ originX, originY, width, height }, Math.min(1, MaxReadSide / Math.max(width, height)));
};

export const importScreenReadGrid = Effect.fn('importScreenReadGrid')(
    function* (uri: string) {
        yield* Effect.sleep(LoaderPaintDelayMillisecondsConstant);

        const source = yield* importScreenOpenImage(uri);
        const overview = yield* readRegion(source, WholeImageRegion);
        const located = recognizeGrid(overview, Math.max(source.width, source.height) / Math.max(overview.width, overview.height));

        if (located.kind !== GridRecognitionKindEnum.RECOGNIZED) {
            return null;
        }

        const closer = located.closerRegion === null ? located : yield* Effect.map(readRegion(source, located.closerRegion), recognizeGrid);
        const service = yield* PuzzleGenerationService;

        return yield* service.repair(closer.kind === GridRecognitionKindEnum.RECOGNIZED ? closer : located, UncertainConfidence);
    },
    Effect.scoped,
    Effect.orDie
);
