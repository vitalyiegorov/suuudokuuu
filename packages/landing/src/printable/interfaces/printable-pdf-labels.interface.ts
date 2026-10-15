import type { DifficultyEnum } from '@suuudokuuu/generator';

export interface PrintablePdfLabelsInterface {
    readonly bookletNames: Readonly<Record<DifficultyEnum, string>>;
    readonly puzzlesHeading: string;
    readonly solutionsHeading: string;
    readonly puzzleLabel: string;
    readonly solutionLabel: string;
    readonly documentTitle: (bookletName: string) => string;
    readonly puzzleCountLine: (puzzleCount: number) => string;
    readonly pageCountLine: (pageCount: number, puzzlesPerPage: number) => string;
    readonly playMoreLine: (siteOrigin: string) => string;
}
