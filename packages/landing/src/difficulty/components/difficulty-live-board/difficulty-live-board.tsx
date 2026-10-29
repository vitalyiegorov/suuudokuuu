'use client';

import '@suuudokuuu/field-dom/styles.css';
import { setupI18n } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { FieldEngine } from '@suuudokuuu/field-core';
import { FieldGame, getGivenCellKeys } from '@suuudokuuu/field-dom';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { useReducer, useState } from 'react';

import { CLIENT_MESSAGES } from '../../../i18n/constants/client-messages.constant';
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

interface LiveBoardState {
    readonly engine: FieldEngine;
    readonly givenCellKeys: ReturnType<typeof getGivenCellKeys>;
    readonly isForging: boolean;
}

enum LiveBoardActionType {
    FORGE_STARTED = 'FORGE_STARTED',
    FORGE_FAILED = 'FORGE_FAILED',
    PUZZLE_FORGED = 'PUZZLE_FORGED'
}

type LiveBoardAction =
    | { readonly type: LiveBoardActionType.FORGE_STARTED }
    | { readonly type: LiveBoardActionType.FORGE_FAILED }
    | {
          readonly type: LiveBoardActionType.PUZZLE_FORGED;
          readonly engine: FieldEngine;
          readonly givenCellKeys: ReturnType<typeof getGivenCellKeys>;
      };

const createInitialLiveBoardState = ({ difficulty, puzzle, solution }: Props): LiveBoardState => ({
    engine: new FieldEngine({ sudokuString: puzzle, solutionString: solution, difficulty }),
    givenCellKeys: getGivenCellKeys(puzzle),
    isForging: false
});

const liveBoardReducer = (state: LiveBoardState, action: LiveBoardAction): LiveBoardState => {
    switch (action.type) {
        case LiveBoardActionType.FORGE_STARTED:
            return { ...state, isForging: true };
        case LiveBoardActionType.FORGE_FAILED:
            return { ...state, isForging: false };
        case LiveBoardActionType.PUZZLE_FORGED:
            return { engine: action.engine, givenCellKeys: action.givenCellKeys, isForging: false };
        default:
            return state;
    }
};

export const DifficultyLiveBoard = (props: Props) => {
    const { difficulty } = props;
    const [i18n] = useState(() => setupI18n({ locale: document.documentElement.lang, messages: CLIENT_MESSAGES }));
    const fieldLabels = buildFieldLabels(i18n);
    const [{ engine, givenCellKeys, isForging }, dispatch] = useReducer(liveBoardReducer, props, createInitialLiveBoardState);
    const difficultyName = i18n._(DIFFICULTY_NAME_MESSAGES[difficulty]);

    const startForgedPuzzle = ({ solutionString, sudokuString }: SerializedPuzzleInterface) => {
        dispatch({
            type: LiveBoardActionType.PUZZLE_FORGED,
            engine: new FieldEngine({ sudokuString, solutionString, difficulty }),
            givenCellKeys: getGivenCellKeys(sudokuString)
        });
    };

    const handleNewPuzzle = () => {
        dispatch({ type: LiveBoardActionType.FORGE_STARTED });
        import('@suuudokuuu/puzzle-forge')
            .then(({ forgeSerializablePuzzle }) => void startForgedPuzzle(forgeSerializablePuzzle(difficulty)))
            .catch(() => void dispatch({ type: LiveBoardActionType.FORGE_FAILED }));
    };

    return (
        <div className="difficulty-board__live">
            <FieldGame engine={engine} givenCellKeys={givenCellKeys} labels={fieldLabels} narrationRenderer={renderTechniqueNarration} />
            <div className="difficulty-board__actions">
                <button className="technique-embed__action" disabled={isForging} onClick={handleNewPuzzle} type="button">
                    {i18n._(msg`New ${difficultyName} puzzle`)}
                </button>
                <a href={buildDifficultyPlayUrl(difficulty)}>{i18n._(msg`Play ${difficultyName} in the full app`)}</a>
            </div>
        </div>
    );
};
