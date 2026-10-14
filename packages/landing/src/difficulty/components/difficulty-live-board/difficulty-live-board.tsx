'use client';

import '@suuudokuuu/field-dom/styles.css';
import { FieldEngine } from '@suuudokuuu/field-core';
import { FieldGame, getGivenCellKeys } from '@suuudokuuu/field-dom';
import { useState } from 'react';

import { FIELD_LABELS } from '../../../techniques/constants/field-labels.constant';
import { renderTechniqueNarration } from '../../../techniques/utils/render-technique-narration.util';
import { DIFFICULTY_NAMES } from '../../constants/difficulty-name.constant';
import { buildDifficultyPlayUrl } from '../../utils/build-difficulty-play-url.util';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';

interface Props {
    difficulty: DifficultyEnum;
    puzzle: string;
    solution: string;
}

export const DifficultyLiveBoard = ({ difficulty, puzzle, solution }: Props) => {
    const [engine, setEngine] = useState(() => new FieldEngine({ sudokuString: puzzle, solutionString: solution, difficulty }));
    const [givenCellKeys, setGivenCellKeys] = useState(() => getGivenCellKeys(puzzle));
    const [isForging, setIsForging] = useState(false);
    const difficultyName = DIFFICULTY_NAMES[difficulty];

    const startForgedPuzzle = ({ solutionString, sudokuString }: SerializedPuzzleInterface) => {
        setEngine(new FieldEngine({ sudokuString, solutionString, difficulty }));
        setGivenCellKeys(getGivenCellKeys(sudokuString));
        setIsForging(false);
    };

    const handleNewPuzzle = () => {
        setIsForging(true);
        import('@suuudokuuu/puzzle-forge')
            .then(({ forgeSerializablePuzzle }) => void startForgedPuzzle(forgeSerializablePuzzle(difficulty)))
            .catch(() => void setIsForging(false));
    };

    return (
        <div className="difficulty-board__live">
            <FieldGame engine={engine} givenCellKeys={givenCellKeys} labels={FIELD_LABELS} narrationRenderer={renderTechniqueNarration} />
            <div className="difficulty-board__actions">
                <button className="technique-embed__action" disabled={isForging} onClick={handleNewPuzzle} type="button">
                    New {difficultyName} puzzle
                </button>
                <a href={buildDifficultyPlayUrl(difficulty)}>Play {difficultyName} in the full app</a>
            </div>
        </div>
    );
};
