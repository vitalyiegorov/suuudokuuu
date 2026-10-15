'use client';

import '@suuudokuuu/field-dom/styles.css';
import { useLingui } from '@lingui/react/macro';
import { FieldEngine } from '@suuudokuuu/field-core';
import { FieldBoard, FieldStepPlayer, getGivenCellKeys } from '@suuudokuuu/field-dom';
import { useState } from 'react';

import { buildFieldLabels } from '../../../techniques/utils/build-field-labels.util';
import { renderTechniqueNarration } from '../../../techniques/utils/render-technique-narration.util';

import type { SolverStepInterface } from '../../interfaces/solver-step.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    step: SolverStepInterface;
    difficulty: DifficultyEnum;
}

const startEngine = ({ boardBefore, eliminatedCandidates, script }: SolverStepInterface, difficulty: DifficultyEnum): FieldEngine => {
    const engine = new FieldEngine({ sudokuString: boardBefore, difficulty, eliminatedCandidates, showAutoCandidates: true });

    engine.startStepScript(script);

    return engine;
};

export const SolverStepPreview = ({ difficulty, step }: Props) => {
    const { i18n } = useLingui();
    const fieldLabels = buildFieldLabels(i18n);
    const [engine] = useState(() => startEngine(step, difficulty));
    const givenCellKeys = getGivenCellKeys(step.boardBefore);

    return (
        <div className="solver-preview">
            <FieldBoard engine={engine} givenCellKeys={givenCellKeys} labels={fieldLabels.board} />
            <FieldStepPlayer engine={engine} labels={fieldLabels.stepPlayer} narrationRenderer={renderTechniqueNarration} />
        </div>
    );
};
