import { forgeSerializablePuzzle, getDailyDifficulty, getDailyPuzzleSeed } from '@suuudokuuu/puzzle-forge';
import Link from 'next/link';

import { sudokuDifficultyRatingPageMetadata } from '../../../app/(en)/guides/sudoku-difficulty-rating/metadata';
import { solverPageMetadata } from '../../../app/(en)/solver/metadata';
import { DIFFICULTY_NAMES } from '../../../difficulty/constants/difficulty-name.constant';
import { DIFFICULTY_PAGE_PATHS } from '../../../difficulty/constants/difficulty-page-path.constant';
import { PlayablePuzzleBoard } from '../../../puzzle/components/playable-puzzle-board/playable-puzzle-board';
import { PuzzleBoard } from '../../../puzzle/components/puzzle-board/puzzle-board';
import { buildSharedPuzzleUrl } from '../../../puzzle/utils/build-shared-puzzle-url.util';
import { countClues } from '../../../puzzle/utils/count-clues.util';
import { SITE_ORIGIN } from '../../../seo/constants/site.constant';
import { SolvePathBuilder } from '../../../solver/classes/solve-path-builder';
import { SolvePathList } from '../../../solver/components/solve-path-list/solve-path-list';
import { getSolvePathTechniques } from '../../../solver/utils/get-solve-path-techniques.util';
import { TechniqueLinkList } from '../../../techniques/components/technique-link-list/technique-link-list';
import { DAILY_BUILD_DATE } from '../../constants/daily-archive.constant';
import { formatDailyDate } from '../../utils/format-daily-date.util';

interface Props {
    date: string;
}

// oxlint-disable-next-line max-lines-per-function -- Layout/form component requires many lines
export const DailyPuzzle = ({ date }: Props) => {
    const difficulty = getDailyDifficulty(date);
    const puzzle = forgeSerializablePuzzle(difficulty, getDailyPuzzleSeed(date));
    const { steps } = new SolvePathBuilder(puzzle.sudokuString).build();
    const formattedDate = formatDailyDate(date);
    const difficultyName = DIFFICULTY_NAMES[difficulty];
    const clueCount = countClues(puzzle.sudokuString);
    const ratingLabel = puzzle.isRatingCeiling ? `${puzzle.rating}+` : String(puzzle.rating);
    const appLink =
        date === DAILY_BUILD_DATE ? (
            <a className="hero__cta" href={`${SITE_ORIGIN}/daily`}>
                Open today’s daily challenge in the app
            </a>
        ) : (
            <a className="hero__cta" href={buildSharedPuzzleUrl(puzzle, difficulty)}>
                Open this puzzle in the app
            </a>
        );

    return (
        <>
            <p>
                The daily sudoku for {formattedDate} is a <Link href={DIFFICULTY_PAGE_PATHS[difficulty]}>{difficultyName}</Link> puzzle with{' '}
                {clueCount} clues and an SE rating of {ratingLabel}. It is the same grid the Suuudokuuu app serves as its daily challenge
                that day, everywhere in the world: the board is forged from the UTC date alone, so the app, this page and the archive all
                arrive at it independently.
            </p>
            <PlayablePuzzleBoard difficulty={difficulty} puzzle={puzzle}>
                The {difficultyName} daily sudoku for {formattedDate}.
            </PlayablePuzzleBoard>
            {appLink}
            <dl className="solver-output">
                <dt className="solver-output__term">Difficulty</dt>
                <dd className="solver-output__description">{difficultyName}</dd>
                <dt className="solver-output__term">SE rating</dt>
                <dd className="solver-output__description">{ratingLabel}</dd>
                <dt className="solver-output__term">Logical steps</dt>
                <dd className="solver-output__description">{steps.length}</dd>
            </dl>
            <h2>Techniques this puzzle needs</h2>
            <p>
                Solved the way the SE rating measures it, reaching for the cheapest technique that still makes progress, this puzzle needs{' '}
                <TechniqueLinkList techniques={getSolvePathTechniques(steps)} />. The hardest of them sets its rating; the{' '}
                <Link href={sudokuDifficultyRatingPageMetadata.path}>sudoku difficulty rating guide</Link> explains the scale.
            </p>
            <h2>Step-by-step solution</h2>
            <p>
                Every placement and elimination below is proved by a named technique, in the order the engine found them, with each
                technique linked to its guide. Stuck on a different puzzle? The{' '}
                <Link href={solverPageMetadata.path}>step-by-step solver</Link> narrates any grid you paste.
            </p>
            <details>
                <summary>Show all {steps.length} steps</summary>
                <SolvePathList steps={steps} />
            </details>
            <details>
                <summary>Show the completed grid</summary>
                <PuzzleBoard givens={puzzle.solutionString}>The completed grid for {formattedDate}.</PuzzleBoard>
            </details>
        </>
    );
};
