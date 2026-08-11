'use client';

import '@suuudokuuu/field-dom/styles.css';

import { FieldEngine, findStepScript } from '@suuudokuuu/field-core';
import { FieldGame, getGivenCellKeys } from '@suuudokuuu/field-dom';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { createTechniqueStrategies } from '@suuudokuuu/techniques';
import { useState } from 'react';

import { isDefined } from '@rnw-community/shared';

import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { FIELD_LABELS } from '../../constants/field-labels.constant';
import { renderTechniqueNarration } from '../../utils/render-technique-narration.util';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    board: string;
    technique: SolutionTechniqueEnum;
}

export const TechniqueLiveBoard = ({ board, technique }: Props) => {
    const [engine] = useState(() => new FieldEngine({ sudokuString: board, difficulty: DifficultyEnum.Hard, showAutoCandidates: true }));
    const givenCellKeys = getGivenCellKeys(board);

    const handleShowTechnique = () => {
        const strategies = createTechniqueStrategies().filter(strategy => strategy.technique === technique);
        const script = findStepScript(engine.Sudoku, strategies);

        if (isDefined(script)) {
            engine.startStepScript(script);
        }
    };

    return (
        <div className="technique-embed__live">
            <button className="technique-embed__action" onClick={handleShowTechnique} type="button">
                Show me the technique
            </button>
            <FieldGame engine={engine} givenCellKeys={givenCellKeys} labels={FIELD_LABELS} narrationRenderer={renderTechniqueNarration} />
            <p className="technique-embed__footer">
                Pick a cell, type a digit, switch to notes for candidates, and undo whenever you like.{' '}
                <a href={SITE_PLAY_URL}>Play full puzzles</a>.
            </p>
        </div>
    );
};
