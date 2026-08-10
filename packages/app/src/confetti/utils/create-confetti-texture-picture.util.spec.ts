import { describe, expect, it, jest } from '@jest/globals';

import { confettiTextureSizeConstant } from '../constants/confetti-physics.constant';

import { createConfettiTexturePicture } from './create-confetti-texture-picture.util';

interface MockSkRect {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

interface MockSkColor {
    readonly colorName: string;
}

interface MockSkPaint {
    readonly setColor: (color: MockSkColor) => void;
}

interface MockSkCanvas {
    readonly drawRect: (rect: MockSkRect, paint: MockSkPaint) => void;
}

interface MockSkPicture {
    readonly pictureId: string;
}

interface MockSkPictureRecorder {
    readonly beginRecording: (bounds: MockSkRect) => MockSkCanvas;
    readonly finishRecordingAsPicture: () => MockSkPicture;
}

const expectedBounds: MockSkRect = { x: 0, y: 0, width: confettiTextureSizeConstant, height: confettiTextureSizeConstant };
const mockWhiteColor: MockSkColor = { colorName: 'white' };
const mockFinishedPicture: MockSkPicture = { pictureId: 'confetti-texture-picture' };

const mockSetColor = jest.fn<(color: MockSkColor) => void>();
const mockPaintInstance: MockSkPaint = { setColor: mockSetColor };

const mockDrawRect = jest.fn<(rect: MockSkRect, paint: MockSkPaint) => void>();
const mockCanvasInstance: MockSkCanvas = { drawRect: mockDrawRect };

const mockBeginRecording = jest.fn<(bounds: MockSkRect) => MockSkCanvas>(() => mockCanvasInstance);
const mockFinishRecordingAsPicture = jest.fn<() => MockSkPicture>(() => mockFinishedPicture);
const mockRecorderInstance: MockSkPictureRecorder = {
    beginRecording: mockBeginRecording,
    finishRecordingAsPicture: mockFinishRecordingAsPicture
};

const mockPictureRecorder = jest.fn<() => MockSkPictureRecorder>(() => mockRecorderInstance);
const mockXYWHRect = jest.fn<(x: number, y: number, width: number, height: number) => MockSkRect>((x, y, width, height) => ({
    x,
    y,
    width,
    height
}));
const mockPaint = jest.fn<() => MockSkPaint>(() => mockPaintInstance);
const mockColor = jest.fn<(colorName: string) => MockSkColor>(colorName => ({ colorName }));

jest.mock('@shopify/react-native-skia', () => ({
    Skia: {
        Color: (colorName: string) => mockColor(colorName),
        Paint: () => mockPaint(),
        PictureRecorder: () => mockPictureRecorder(),
        XYWHRect: (x: number, y: number, width: number, height: number) => mockXYWHRect(x, y, width, height)
    }
}));

describe('createConfettiTexturePicture', () => {
    const picture = createConfettiTexturePicture();

    it('opens a recorder and records into a canvas covering the full texture bounds', () => {
        expect(mockPictureRecorder).toHaveBeenCalledTimes(1);
        expect(mockXYWHRect).toHaveBeenCalledWith(0, 0, confettiTextureSizeConstant, confettiTextureSizeConstant);
        expect(mockBeginRecording).toHaveBeenCalledWith(expectedBounds);
    });

    it('paints the bounds rect white', () => {
        expect(mockPaint).toHaveBeenCalledTimes(1);
        expect(mockColor).toHaveBeenCalledWith('white');
        expect(mockSetColor).toHaveBeenCalledWith(mockWhiteColor);
        expect(mockDrawRect).toHaveBeenCalledWith(expectedBounds, mockPaintInstance);
    });

    it('sets the paint color before drawing the rect', () => {
        const [setColorOrder] = mockSetColor.mock.invocationCallOrder;
        const [drawRectOrder] = mockDrawRect.mock.invocationCallOrder;

        expect(setColorOrder).toBeLessThan(drawRectOrder);
    });

    it('returns the picture finished by the recorder', () => {
        expect(mockFinishRecordingAsPicture).toHaveBeenCalledTimes(1);
        expect(picture).toBe(mockFinishedPicture);
    });
});
