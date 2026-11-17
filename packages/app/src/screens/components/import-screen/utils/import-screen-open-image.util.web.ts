import * as Effect from 'effect/Effect';

import { isDefined } from '@rnw-community/shared';

import type { RgbaImageInterface } from '@suuudokuuu/grid-vision';
import type { ActionCrop } from 'expo-image-manipulator';

export const importScreenOpenImage = Effect.fn('importScreenOpenImage')(function* (uri: string) {
    yield* Effect.addFinalizer(() => Effect.sync(() => void window.URL.revokeObjectURL(uri)));

    const image = new Image();
    image.src = uri;
    yield* Effect.tryPromise(() => image.decode());

    const read = (crop: ActionCrop['crop'], scale: number): Effect.Effect<RgbaImageInterface> =>
        Effect.sync(() => {
            const canvas = document.createElement('canvas');
            canvas.width = Math.max(1, Math.round(crop.width * scale));
            canvas.height = Math.max(1, Math.round(crop.height * scale));
            const context = canvas.getContext('2d');

            if (!isDefined(context)) {
                return { width: 0, height: 0, data: new Uint8ClampedArray() };
            }

            context.imageSmoothingQuality = 'high';
            context.drawImage(image, crop.originX, crop.originY, crop.width, crop.height, 0, 0, canvas.width, canvas.height);

            return context.getImageData(0, 0, canvas.width, canvas.height);
        });

    return { width: image.naturalWidth, height: image.naturalHeight, read };
});
