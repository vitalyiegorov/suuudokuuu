import { describe, expect, it, jest } from '@jest/globals';
import { i18n } from '@lingui/core';
import { StepScriptStepKindEnum } from '@suuudokuuu/field-core';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { fireEvent, screen } from '@testing-library/react-native';
import { useState } from 'react';
import { AccessibilityInfo, Pressable, Text } from 'react-native';

import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { renderWithGameContext } from '../../../@generic/utils/render-with-game-context.mock';
import { gameGetStepNarration } from '../../utils/game-get-step-narration.util';

import { HintStepNarration } from './hint-step-narration';
import { HintStepNarrationSelectors } from './hint-step-narration.selectors';

import type { StepScriptStepType } from '@suuudokuuu/field-core';

const narrationLineCount = 3;
const patternCell = { x: 1, y: 0, value: 0, group: 0 };
const narration = { technique: SolutionTechniqueEnum.NakedPair, cells: [patternCell], values: [4] };

const scriptSteps: StepScriptStepType[] = [
    {
        kind: StepScriptStepKindEnum.RevealCandidates,
        patternCells: [patternCell],
        candidates: [{ cell: patternCell, value: 4 }],
        narration
    },
    { kind: StepScriptStepKindEnum.PlaceValue, placement: { cell: patternCell, value: 4 }, narration }
];

const NarrationHarness = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [nudgeCount, setNudgeCount] = useState(0);

    const handleNudge = () => void setNudgeCount(nudgeCount + 1);
    const handleNextStep = () => void setStepIndex(1);

    return (
        <>
            <HintStepNarration lineCount={narrationLineCount} step={scriptSteps[stepIndex]} />
            <Pressable onPress={handleNudge} testID="nudge" />
            <Pressable onPress={handleNextStep} testID="next" />
            <Text testID="nudgeCount">{nudgeCount}</Text>
        </>
    );
};

describe('HintStepNarration', () => {
    it('should announce the narration of the step it renders', async () => {
        expect.assertions(2);

        const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);

        await renderWithGameContext(<NarrationHarness />);

        const narrationText = i18n._(
            gameGetStepNarration(scriptSteps[0], i18n._(techniqueLabelsConstant[SolutionTechniqueEnum.NakedPair]))
        );

        expect(screen.getByTestId(HintStepNarrationSelectors.Narration)).toHaveTextContent(narrationText);
        expect(announce).toHaveBeenCalledWith(narrationText);

        announce.mockRestore();
    });

    it('should announce again only when the step changes', async () => {
        expect.assertions(3);

        const announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => undefined);

        await renderWithGameContext(<NarrationHarness />);
        await fireEvent.press(screen.getByTestId('nudge'));

        expect(screen.getByTestId('nudgeCount')).toHaveTextContent('1');
        expect(announce).toHaveBeenCalledTimes(1);

        await fireEvent.press(screen.getByTestId('next'));

        expect(announce).toHaveBeenCalledTimes(2);

        announce.mockRestore();
    });
});
