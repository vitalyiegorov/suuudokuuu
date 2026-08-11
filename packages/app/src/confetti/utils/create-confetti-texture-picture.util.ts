import { Skia } from '@shopify/react-native-skia';

import { confettiTextureSizeConstant } from '../constants/confetti-physics.constant';

import type { SkPicture } from '@shopify/react-native-skia';

export const createConfettiTexturePicture = (): SkPicture => {
    const recorder = Skia.PictureRecorder();
    const bounds = Skia.XYWHRect(0, 0, confettiTextureSizeConstant, confettiTextureSizeConstant);
    const canvas = recorder.beginRecording(bounds);
    const paint = Skia.Paint();

    paint.setColor(Skia.Color('white'));
    canvas.drawRect(bounds, paint);

    return recorder.finishRecordingAsPicture();
};
