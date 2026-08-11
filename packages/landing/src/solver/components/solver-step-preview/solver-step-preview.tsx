'use client';

import '@suuudokuuu/field-dom/styles.css';

import { FieldEngine } from '@suuudokuuu/field-core';
import { FieldBoard, FieldStepPlayer, getGivenCellKeys } from '@suuudokuuu/field-dom';
import { useState } from 'react';

import { FIELD_LABELS } from '../../../techniques/constants/field-labels.constant';
import { renderTechniqueNarration } from '../../../techniques/utils/render-technique-narration.util';

import type { StepScriptInterface } from '@suuudokuuu/field-core';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    board: string;
    difficulty: DifficultyEnum;
    script: StepScriptInterface;
}

const startEngine = (board: string, difficulty: DifficultyEnum, script: StepScriptInterface): FieldEngine => {
    const engine = new FieldEngine({ sudokuString: board, difficulty, showAutoCandidates: true });

    engine.startStepScript(script);

    return engine;
};

export const SolverStepPreview = ({ board, difficulty, script }: Props) => {
    const [engine] = useState(() => startEngine(board, difficulty, script));
    const givenCellKeys = getGivenCellKeys(board);

    return (
        <div className="solver-preview">
            <FieldBoard engine={engine} givenCellKeys={givenCellKeys} labels={FIELD_LABELS.board} />
            <FieldStepPlayer engine={engine} labels={FIELD_LABELS.stepPlayer} narrationRenderer={renderTechniqueNarration} />
        </div>
    );
};
