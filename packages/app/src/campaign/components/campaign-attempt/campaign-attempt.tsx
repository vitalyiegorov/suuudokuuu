import { Trans, useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';

import { emptyFn, isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { Field } from '../../../game/components/field/field';
import { GameContext } from '../../../game/context/game.context';
import { gameGetStepNarration } from '../../../game/utils/game-get-step-narration.util';
import { CampaignSelectors } from '../../campaign.selectors';
import { campaignStyles as styles } from '../../campaign.styles';
import { useCampaignAttempt } from '../../hooks/use-campaign-attempt.hook';
import { CampaignDigit } from '../campaign-digit/campaign-digit';

const maximumCellSize = 54;

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly technique: SolutionTechniqueEnum;
    readonly board: string;
    readonly practiceId?: string;
    readonly completed: boolean;
}

export const CampaignAttempt = ({ technique, board, practiceId, completed }: Props) => {
    const { i18n, t } = useLingui();
    const [boardWidth, setBoardWidth] = useState(0);
    const handleLayout = (event: LayoutChangeEvent) => void setBoardWidth(event.nativeEvent.layout.width);
    const { engine, script, isComplete, isSaving, feedback, snapshot, handleTeach, handleInput } = useCampaignAttempt(
        technique,
        board,
        completed,
        practiceId
    );
    const isPractice = isDefined(practiceId);
    const handleSelect = () => void engine.selectCell(script?.placement?.cell ?? script?.eliminations[0]?.cell);
    const handleNext = () => engine.stepScriptNext();
    if (!isDefined(script)) {
        return (
            <BlackText>
                <Trans>This lesson is unavailable.</Trans>
            </BlackText>
        );
    }
    const currentStep = snapshot.stepScript?.steps[snapshot.stepIndex];
    const techniqueName = i18n._(techniqueLabelsConstant[technique]);
    const instruction = isDefined(script.placement)
        ? t`Use this technique to fill the selected cell. Choose the digit it proves.`
        : t`Use this technique to remove one candidate from the selected cell. Choose the digit to remove.`;
    const cellSize = Math.min(maximumCellSize, Math.floor(boardWidth / 9));
    const context = { engine, snapshot, create: emptyFn, createDaily: emptyFn, createFromState: emptyFn, isCreatingGame: false };
    const isInputDisabled = isComplete || isSaving;
    const isNextDisabled = snapshot.stepIndex >= script.steps.length - 1;

    return (
        <GameContext value={context}>
            <View style={styles.card}>
                {isPractice ? (
                    <BlackText>{instruction}</BlackText>
                ) : (
                    <AppButton
                        disabled={isSaving}
                        onPress={handleTeach}
                        testID={CampaignSelectors.TEACH}
                        text={t`Show teaching example`}
                        variant="secondary"
                    />
                )}
                <View onLayout={handleLayout} style={styles.board}>
                    <Field cellMargin={0} cellSize={cellSize} onSelect={handleSelect} ref={null} />
                </View>
                {isPractice ? (
                    <View style={styles.row}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
                            <CampaignDigit disabled={isInputDisabled} key={value} onInput={handleInput} value={value} />
                        ))}
                    </View>
                ) : null}
                {isDefined(currentStep) ? (
                    <View>
                        <BlackText>{i18n._(gameGetStepNarration(currentStep, techniqueName))}</BlackText>
                        <AppButton
                            disabled={isNextDisabled}
                            onPress={handleNext}
                            testID={CampaignSelectors.NEXT}
                            text={t`Next`}
                            variant="secondary"
                        />
                    </View>
                ) : null}
                <BlackText testID={CampaignSelectors.FEEDBACK}>{feedback}</BlackText>
                {isComplete ? (
                    <BlackText testID={CampaignSelectors.SUCCESS}>
                        <Trans>Practice complete without help.</Trans>
                    </BlackText>
                ) : null}
            </View>
        </GameContext>
    );
};
