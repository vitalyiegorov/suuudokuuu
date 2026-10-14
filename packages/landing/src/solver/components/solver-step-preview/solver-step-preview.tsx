'use client';

import '@suuudokuuu/field-dom/styles.css';
import { useLingui } from '@lingui/react/macro';
import { FieldEngine } from '@suuudokuuu/field-core';
import { FieldBoard, FieldStepPlayer, getGivenCellKeys } from '@suuudokuuu/field-dom';
import { useState } from 'react';

import { buildFieldLabels } from '../../../techniques/utils/build-field-labels.util';
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
    const { i18n } = useLingui();
    const fieldLabels = buildFieldLabels(i18n);
    const [engine] = useState(() => startEngine(board, difficulty, script));
    const givenCellKeys = getGivenCellKeys(board);

    return (
        <div className="solver-preview">
            <FieldBoard engine={engine} givenCellKeys={givenCellKeys} labels={fieldLabels.board} />
            <FieldStepPlayer engine={engine} labels={fieldLabels.stepPlayer} narrationRenderer={renderTechniqueNarration} />
        </div>
    );
};
