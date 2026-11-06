import { GridRecognitionKindEnum, recognizeGrid } from '@suuudokuuu/grid-vision';
import * as Effect from 'effect/Effect';
import * as FetchHttpClient from 'effect/http/FetchHttpClient';
import * as HttpClient from 'effect/http/HttpClient';

import { isDefined } from '@rnw-community/shared';

import type { GridRecognitionType } from '@suuudokuuu/grid-vision';

const MaxImageSide = 768;

export const importScreenReadGrid: (uri: string) => Effect.Effect<GridRecognitionType> = Effect.fn('importScreenReadGrid')(
    function* (uri: string) {
        yield* Effect.addFinalizer(() => Effect.sync(() => void window.URL.revokeObjectURL(uri)));
        const response = yield* HttpClient.get(uri);
        const blob = new Blob([yield* response.arrayBuffer]);
        const bitmap = yield* Effect.acquireRelease(
            Effect.tryPromise(() => createImageBitmap(blob)),
            resource => Effect.sync(() => void resource.close())
        );
        const scale = Math.min(1, MaxImageSide / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        const context = canvas.getContext('2d');
        context?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const pixels = context?.getImageData(0, 0, canvas.width, canvas.height);

        return isDefined(pixels) ? recognizeGrid(pixels) : { kind: GridRecognitionKindEnum.GRID_NOT_FOUND as const };
    },
    Effect.provide(FetchHttpClient.layer),
    Effect.scoped,
    Effect.orDie
);
