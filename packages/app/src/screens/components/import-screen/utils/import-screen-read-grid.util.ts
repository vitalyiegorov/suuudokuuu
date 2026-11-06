import { recognizeGrid } from '@suuudokuuu/grid-vision';
import * as Effect from 'effect/Effect';
import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { decode } from 'jpeg-js';

import { LoaderPaintDelayMillisecondsConstant } from '../../../../game/constant/loader-paint-delay.constant';

import type { GridRecognitionType } from '@suuudokuuu/grid-vision';

const MaxImageSide = 768;

export const importScreenReadGrid: (uri: string) => Effect.Effect<GridRecognitionType> = Effect.fn('importScreenReadGrid')(
    function* (uri: string) {
        yield* Effect.addFinalizer(() => Effect.ignore(Effect.try(() => void new File(uri).delete())));
        yield* Effect.sleep(LoaderPaintDelayMillisecondsConstant);

        const context = yield* Effect.acquireRelease(
            Effect.sync(() => ImageManipulator.manipulate(uri, { maxWidth: MaxImageSide, maxHeight: MaxImageSide })),
            resource => Effect.sync(() => void resource.release())
        );
        const image = yield* Effect.acquireRelease(
            Effect.tryPromise(() => context.renderAsync()),
            resource => Effect.sync(() => void resource.release())
        );
        const saved = yield* Effect.acquireRelease(
            Effect.tryPromise(() => image.saveAsync({ base64: true, format: SaveFormat.JPEG })),
            resource => Effect.sync(() => void new File(resource.uri).delete())
        );
        const bytes = Uint8Array.from(atob(saved.base64 ?? ''), character => character.charCodeAt(0));
        const { width, height, data } = decode(bytes, { useTArray: true, formatAsRGBA: true });

        return recognizeGrid({ width, height, data: new Uint8ClampedArray(data) });
    },
    Effect.scoped,
    Effect.orDie
);
