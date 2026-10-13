import { Trans, useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { CampaignSelectors } from '../../campaign.selectors';
import { campaignStyles as styles } from '../../campaign.styles';
import { useCampaignPractice } from '../../hooks/use-campaign-practice.hook';
import { CampaignBoard } from '../campaign-board/campaign-board';
import { CampaignDigit } from '../campaign-digit/campaign-digit';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly technique: SolutionTechniqueEnum;
    readonly board: string;
    readonly practiceId: string;
    readonly onRetry: () => void;
}

export const CampaignPractice = ({ technique, board, practiceId, onRetry }: Props) => {
    const { t } = useLingui();
    const { engine, deductions, isComplete, isSaving, assisted, feedback, handleInput } = useCampaignPractice(technique, board, practiceId);
    const firstDeduction = deductions.at(0);
    if (!isDefined(firstDeduction)) {
        return (
            <BlackText>
                <Trans>This lesson is unavailable.</Trans>
            </BlackText>
        );
    }
    const instruction =
        firstDeduction.kind === 'placement'
            ? t`Find a cell this technique can fill. Select it, then choose the digit it proves.`
            : t`Find a candidate this technique can remove. Select its cell, then choose the digit to remove.`;
    const isInputDisabled = isComplete || isSaving;
    const successText = assisted
        ? t`Practice complete with assistance. Retry without mistakes to master it.`
        : t`Practice complete without help.`;

    return (
        <CampaignBoard engine={engine}>
            <BlackText>{instruction}</BlackText>
            <View style={styles.row}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(value => (
                    <CampaignDigit disabled={isInputDisabled} key={value} onInput={handleInput} value={value} />
                ))}
            </View>
            <BlackText testID={CampaignSelectors.FEEDBACK}>{feedback}</BlackText>
            {isComplete ? <BlackText testID={CampaignSelectors.SUCCESS}>{successText}</BlackText> : null}
            {assisted ? <AppButton disabled={isSaving} onPress={onRetry} text={t`Retry practice`} variant="secondary" /> : null}
        </CampaignBoard>
    );
};
