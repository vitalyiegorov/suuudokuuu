import { DifficultyEnum } from '@suuudokuuu/generator';

export const DifficultyComplexitySliderDifficulties: readonly DifficultyEnum[] = [
    DifficultyEnum.Newbie,
    DifficultyEnum.Easy,
    DifficultyEnum.Medium,
    DifficultyEnum.Hard,
    DifficultyEnum.Nightmare,
    DifficultyEnum.Hell
];

export const DifficultyComplexitySliderInitialIndex = 1;
const DifficultyComplexitySliderPreviewColumnCount = 5;
export const DifficultyComplexitySliderPreviewCellCount =
    DifficultyComplexitySliderPreviewColumnCount * DifficultyComplexitySliderPreviewColumnCount;
export const DifficultyComplexitySliderGridCells = Array.from(
    { length: DifficultyComplexitySliderPreviewCellCount },
    (_unusedValue, cellIndex) => cellIndex
);
export const DifficultyComplexitySliderActiveCellBaseCount = 5;
export const DifficultyComplexitySliderActiveCellStep = 4;
export const DifficultyComplexitySliderCellRankMultiplier = 7;
export const DifficultyComplexitySliderPreviewActiveCellScale = 1;
export const DifficultyComplexitySliderPreviewCellBaseOpacity = 0.44;
export const DifficultyComplexitySliderPreviewCellOpacityStep = 0.1;
export const DifficultyComplexitySliderPreviewInactiveCellOpacity = 0.28;
export const DifficultyComplexitySliderPreviewInactiveCellScale = 0.58;
export const DifficultyComplexitySliderPreviewLayoutAnimationDurationMs = 160;
export const DifficultyComplexitySliderProgressAnimationDurationMs = 220;
export const DifficultyComplexitySliderPreviewDecoratedCellOpacity = 0.9;
const DifficultyComplexitySliderPreviewTopLeftCellIndex = 0;
const DifficultyComplexitySliderPreviewTopRightCellIndex = 4;
const DifficultyComplexitySliderPreviewStandardMistakeFirstCellIndex = 6;
const DifficultyComplexitySliderPreviewStandardMistakeSecondCellIndex = 13;
const DifficultyComplexitySliderPreviewStandardMistakeThirdCellIndex = 21;
const DifficultyComplexitySliderPreviewRelaxedLeftCellIndex = 10;
const DifficultyComplexitySliderPreviewRelaxedRightCellIndex = 14;
const DifficultyComplexitySliderPreviewBottomLeftCellIndex = 20;
const DifficultyComplexitySliderPreviewBottomRightCellIndex = 24;
export const DifficultyComplexitySliderStandardMistakeCells = [
    DifficultyComplexitySliderPreviewStandardMistakeFirstCellIndex,
    DifficultyComplexitySliderPreviewStandardMistakeSecondCellIndex,
    DifficultyComplexitySliderPreviewStandardMistakeThirdCellIndex
] as const;
export const DifficultyComplexitySliderRelaxedAccentCells = [
    DifficultyComplexitySliderPreviewTopLeftCellIndex,
    DifficultyComplexitySliderPreviewTopRightCellIndex,
    DifficultyComplexitySliderPreviewRelaxedLeftCellIndex,
    DifficultyComplexitySliderPreviewRelaxedRightCellIndex,
    DifficultyComplexitySliderPreviewBottomLeftCellIndex,
    DifficultyComplexitySliderPreviewBottomRightCellIndex
] as const;
export const DifficultyComplexitySliderHardcoreGuardCells = [
    DifficultyComplexitySliderPreviewTopLeftCellIndex,
    DifficultyComplexitySliderPreviewTopRightCellIndex,
    DifficultyComplexitySliderPreviewBottomLeftCellIndex,
    DifficultyComplexitySliderPreviewBottomRightCellIndex
] as const;

export const DifficultyComplexitySliderMaxIndex = DifficultyComplexitySliderDifficulties.length - 1;
export const DifficultyComplexitySliderThumbRadius = 13;
