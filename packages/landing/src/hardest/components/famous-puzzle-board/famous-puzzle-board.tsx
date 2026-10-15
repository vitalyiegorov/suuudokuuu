import { DifficultyEnum, Sudoku, defaultSudokuConfig } from '@suuudokuuu/generator';
import { ratePuzzle } from '@suuudokuuu/rating';

import { isDefined } from '@rnw-community/shared';

import { INFINITY_CORPUS_PUZZLES } from '../../../difficulty/constants/infinity-corpus.constant';
import { PlayablePuzzleBoard } from '../../../puzzle/components/playable-puzzle-board/playable-puzzle-board';
import { buildSharedPuzzleUrl } from '../../../puzzle/utils/build-shared-puzzle-url.util';
import { countClues } from '../../../puzzle/utils/count-clues.util';

import type { FamousPuzzleInterface } from '../../interfaces/famous-puzzle.interface';
import type { ReactNode } from 'react';

interface Props {
    puzzle: FamousPuzzleInterface;
    children: ReactNode;
}

export const FamousPuzzleBoard = ({ children, puzzle }: Props) => {
    const sudoku = Sudoku.fromString(puzzle.givens, { ...defaultSudokuConfig });
    const sudokuString = sudoku.toString();
    const solutionString = sudoku.FullField.flatMap(row => row.map(cell => cell.value)).join('');
    const boardPuzzle = { sudokuString, solutionString };
    const corpusRecord = INFINITY_CORPUS_PUZZLES.find(entry => entry.puzzle === puzzle.givens);
    const engineRating = ratePuzzle(sudokuString);
    const sharedRating = corpusRecord ?? engineRating;
    const publishedRatingLabel = isDefined(corpusRecord) ? `SE ${corpusRecord.rating}` : 'none we can attribute';
    const engineRatingLabel = engineRating.isCeiling
        ? `${engineRating.rating}+, past every implemented technique`
        : String(engineRating.rating);
    const sharedPuzzleUrl = buildSharedPuzzleUrl(
        { sudokuString, rating: sharedRating.rating, isRatingCeiling: sharedRating.isCeiling },
        DifficultyEnum.Infinity
    );

    return (
        <>
            <PlayablePuzzleBoard difficulty={DifficultyEnum.Infinity} puzzle={boardPuzzle}>
                {children}
            </PlayablePuzzleBoard>
            <dl className="solver-output">
                <dt className="solver-output__term">Clues</dt>
                <dd className="solver-output__description">{countClues(sudokuString)}</dd>
                <dt className="solver-output__term">Published SE rating</dt>
                <dd className="solver-output__description">{publishedRatingLabel}</dd>
                <dt className="solver-output__term">Suuudokuuu rater</dt>
                <dd className="solver-output__description">{engineRatingLabel}</dd>
            </dl>
            <p className="famous-puzzle__actions">
                <a className="hero__cta" href={sharedPuzzleUrl}>
                    Play {puzzle.name} in the app
                </a>
                <a href={`/printable/${puzzle.fileName}.pdf`}>Print {puzzle.name} — PDF with the solution</a>
            </p>
        </>
    );
};
