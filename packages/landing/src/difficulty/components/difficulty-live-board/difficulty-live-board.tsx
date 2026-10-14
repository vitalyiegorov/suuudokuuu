'use client';

import '@suuudokuuu/field-dom/styles.css';
import { msg } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react/macro';
import { FieldEngine } from '@suuudokuuu/field-core';
import { FieldGame, getGivenCellKeys } from '@suuudokuuu/field-dom';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { useState } from 'react';

import { buildFieldLabels } from '../../../techniques/utils/build-field-labels.util';
import { renderTechniqueNarration } from '../../../techniques/utils/render-technique-narration.util';
import { buildDifficultyPlayUrl } from '../../utils/build-difficulty-play-url.util';

import type { MessageDescriptor } from '@lingui/core';
import type { SerializedPuzzleInterface } from '@suuudokuuu/puzzle-forge';

const DIFFICULTY_NAME_MESSAGES: Readonly<Record<DifficultyEnum, MessageDescriptor>> = {
    [DifficultyEnum.Newbie]: msg`Newbie`,
    [DifficultyEnum.Easy]: msg`Easy`,
    [DifficultyEnum.Medium]: msg`Medium`,
    [DifficultyEnum.Hard]: msg`Hard`,
    [DifficultyEnum.Nightmare]: msg`Nightmare`,
    [DifficultyEnum.Hell]: msg`Hell`,
    [DifficultyEnum.Infinity]: msg`Infinity`
};

interface Props {
    difficulty: DifficultyEnum;
    puzzle: string;
    solution: string;
}

export const DifficultyLiveBoard = ({ difficulty, puzzle, solution }: Props) => {
    const { i18n } = useLingui();
    const fieldLabels = buildFieldLabels(i18n);
    const [engine, setEngine] = useState(() => new FieldEngine({ sudokuString: puzzle, solutionString: solution, difficulty }));
    const [givenCellKeys, setGivenCellKeys] = useState(() => getGivenCellKeys(puzzle));
    const [isForging, setIsForging] = useState(false);
    const difficultyName = i18n._(DIFFICULTY_NAME_MESSAGES[difficulty]);

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
            <FieldGame engine={engine} givenCellKeys={givenCellKeys} labels={fieldLabels} narrationRenderer={renderTechniqueNarration} />
            <div className="difficulty-board__actions">
                <button className="technique-embed__action" disabled={isForging} onClick={handleNewPuzzle} type="button">
                    <Trans>New {difficultyName} puzzle</Trans>
                </button>
                <a href={buildDifficultyPlayUrl(difficulty)}>
                    <Trans>Play {difficultyName} in the full app</Trans>
                </a>
            </div>
        </div>
    );
};
