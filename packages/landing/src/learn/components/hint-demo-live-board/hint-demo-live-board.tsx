'use client';

import '@suuudokuuu/field-dom/styles.css';
import { setupI18n } from '@lingui/core';
import { FieldEngine, HintLevelEnum, HintRegionKindEnum, buildStepScriptState, findHintStepScript } from '@suuudokuuu/field-core';
import { useFieldSnapshot } from '@suuudokuuu/field-core/react';
import { FieldBoard, getGivenCellKeys } from '@suuudokuuu/field-dom';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { useState } from 'react';

import { isDefined } from '@rnw-community/shared';

import { CLIENT_MESSAGES } from '../../../i18n/constants/client-messages.constant';
import { SITE_PLAY_URL } from '../../../seo/constants/site.constant';
import { TECHNIQUE_NAMES } from '../../../techniques/constants/technique-name.constant';
import { buildFieldLabels } from '../../../techniques/utils/build-field-labels.util';
import { formatCellLabel } from '../../../techniques/utils/format-cell-label.util';
import { renderTechniqueNarration } from '../../../techniques/utils/render-technique-narration.util';

import type { HintRegionInterface } from '@suuudokuuu/field-core';

const HINT_LEVEL_NAMES: Readonly<Record<HintLevelEnum, string>> = {
    [HintLevelEnum.TECHNIQUE]: 'Technique',
    [HintLevelEnum.PATTERN]: 'Pattern',
    [HintLevelEnum.WALKTHROUGH]: 'Walkthrough'
};

const describeRegion = (hintRegion: HintRegionInterface | null): string => {
    if (!isDefined(hintRegion)) {
        return '';
    }

    if (hintRegion.kind === HintRegionKindEnum.ROW) {
        return ` in row ${hintRegion.number}`;
    }

    if (hintRegion.kind === HintRegionKindEnum.COLUMN) {
        return ` in column ${hintRegion.number}`;
    }

    if (hintRegion.kind === HintRegionKindEnum.BOX) {
        return ` in box ${hintRegion.number}`;
    }

    return isDefined(hintRegion.cell) ? ` around ${formatCellLabel(hintRegion.cell)}` : '';
};

interface Props {
    puzzle: string;
}

export const HintDemoLiveBoard = ({ puzzle }: Props) => {
    const [i18n] = useState(() => setupI18n({ locale: document.documentElement.lang, messages: CLIENT_MESSAGES }));
    const fieldLabels = buildFieldLabels(i18n);
    const [engine] = useState(() => new FieldEngine({ sudokuString: puzzle, difficulty: DifficultyEnum.Medium, showAutoCandidates: true }));
    const snapshot = useFieldSnapshot(engine);
    const givenCellKeys = getGivenCellKeys(puzzle);
    const { hintLevel, hintPageCount, hintPageIndex, revealedImplicationCount, stepIndex, stepScript } = snapshot;

    const handleHint = () => {
        const script = findHintStepScript(engine.Sudoku);

        if (isDefined(script)) {
            engine.startStepScript(script, HintLevelEnum.TECHNIQUE);
        }
    };

    const handleBack = () => void engine.hintBack();

    const handleNext = () => void engine.hintNext();

    const handleApply = () => void engine.applyStepScript();

    const handleClose = () => void engine.stopStepScript();

    if (!isDefined(stepScript)) {
        return (
            <div className="technique-embed__live">
                <FieldBoard engine={engine} givenCellKeys={givenCellKeys} labels={fieldLabels.board} />
                <button className="technique-embed__action" onClick={handleHint} type="button">
                    Give me a hint
                </button>
                <p className="technique-embed__footer">
                    Pick a cell and type a digit, or ask for a hint. <a href={SITE_PLAY_URL}>Play full puzzles</a>.
                </p>
            </div>
        );
    }

    const techniqueName = TECHNIQUE_NAMES[stepScript.technique];
    const { hintRegion } = buildStepScriptState(stepScript, stepIndex, hintLevel, revealedImplicationCount);
    const currentStep = stepScript.steps.at(stepIndex);
    const patternCellLabels = stepScript.patternCells.map(formatCellLabel).join(', ');
    const walkthroughText = isDefined(currentStep) ? renderTechniqueNarration(currentStep) : '';
    const levelTexts: Readonly<Record<HintLevelEnum, string>> = {
        [HintLevelEnum.TECHNIQUE]: `Look for a ${techniqueName}${describeRegion(hintRegion)}.`,
        [HintLevelEnum.PATTERN]: `The ${techniqueName} pattern is highlighted on the board: ${patternCellLabels}.`,
        [HintLevelEnum.WALKTHROUGH]: walkthroughText
    };
    const isLastPage = hintPageIndex >= hintPageCount - 1;
    const isFirstPage = hintPageIndex === 0;
    const levelHeading = `Hint level: ${HINT_LEVEL_NAMES[hintLevel]} (${hintPageIndex + 1} of ${hintPageCount})`;

    return (
        <div className="technique-embed__live">
            <FieldBoard engine={engine} givenCellKeys={givenCellKeys} labels={fieldLabels.board} />
            <div className="hint-demo__panel" role="group" aria-label="Hint">
                <p className="hint-demo__level">{levelHeading}</p>
                <p aria-live="polite" className="hint-demo__narration">
                    {levelTexts[hintLevel]}
                </p>
                <div className="hint-demo__controls">
                    <button className="technique-embed__action" disabled={isFirstPage} onClick={handleBack} type="button">
                        Previous hint
                    </button>
                    <button className="technique-embed__action" disabled={isLastPage} onClick={handleNext} type="button">
                        Next hint
                    </button>
                    <button className="technique-embed__action" disabled={!isLastPage} onClick={handleApply} type="button">
                        Apply to the board
                    </button>
                    <button className="technique-embed__action" onClick={handleClose} type="button">
                        Close hint
                    </button>
                </div>
            </div>
        </div>
    );
};
