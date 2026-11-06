import { GridRecognitionKindEnum, recognizeGrid } from '@suuudokuuu/grid-vision';
import * as Effect from 'effect/Effect';

import { isDefined } from '@rnw-community/shared';

import { LoaderPaintDelayMillisecondsConstant } from '../../../../game/constant/loader-paint-delay.constant';

import type { GridRecognitionType } from '@suuudokuuu/grid-vision';

const MaxImageSide = 768;

export const importScreenReadGrid: (uri: string) => Effect.Effect<GridRecognitionType> = Effect.fn('importScreenReadGrid')(
    function* (uri: string) {
        yield* Effect.addFinalizer(() => Effect.sync(() => void window.URL.revokeObjectURL(uri)));
        yield* Effect.sleep(LoaderPaintDelayMillisecondsConstant);
        const image = new Image();
        image.src = uri;
        yield* Effect.tryPromise(() => image.decode());
        const scale = Math.min(1, MaxImageSide / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        const context = canvas.getContext('2d');
        context?.drawImage(image, 0, 0, canvas.width, canvas.height);
        const pixels = context?.getImageData(0, 0, canvas.width, canvas.height);

        return isDefined(pixels) ? recognizeGrid(pixels) : { kind: GridRecognitionKindEnum.GRID_NOT_FOUND as const };
    },
    Effect.scoped,
    Effect.orDie
);
