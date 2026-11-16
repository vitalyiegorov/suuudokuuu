import * as Effect from 'effect/Effect';
import { File } from 'expo-file-system';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { decode } from 'jpeg-js';

import type { RgbaImageInterface } from '@suuudokuuu/grid-vision';
import type { ActionCrop } from 'expo-image-manipulator';

const MaxSourceSide = 4096;

export const importScreenOpenImage = Effect.fn('importScreenOpenImage')(function* (uri: string) {
    yield* Effect.addFinalizer(() => Effect.ignore(Effect.try(() => void new File(uri).delete())));

    const sourceContext = yield* Effect.acquireRelease(
        Effect.sync(() => ImageManipulator.manipulate(uri, { maxWidth: MaxSourceSide, maxHeight: MaxSourceSide })),
        resource => Effect.sync(() => void resource.release())
    );
    const source = yield* Effect.acquireRelease(
        Effect.tryPromise(() => sourceContext.renderAsync()),
        resource => Effect.sync(() => void resource.release())
    );
    const read = Effect.fn('importScreenOpenImage.read')(function* (crop: ActionCrop['crop'], scale: number) {
        const context = yield* Effect.acquireRelease(
            Effect.sync(() =>
                ImageManipulator.manipulate(source)
                    .crop(crop)
                    .resize({ width: Math.max(1, Math.round(crop.width * scale)) })
            ),
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
        const pixels = decode(
            Uint8Array.from(atob(saved.base64 ?? ''), character => character.charCodeAt(0)),
            { useTArray: true, formatAsRGBA: true }
        );

        return { width: pixels.width, height: pixels.height, data: new Uint8ClampedArray(pixels.data) } satisfies RgbaImageInterface;
    }, Effect.scoped);

    return { width: source.width, height: source.height, read };
});
