import { useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';

import { CampaignSelectors } from '../../campaign.selectors';

interface Props {
    readonly practiceId: string;
    readonly number: number;
    readonly onSelect: (practiceId: string) => void;
    readonly completed: boolean;
}

export const CampaignPracticeButton = ({ practiceId, number, onSelect, completed }: Props) => {
    const { t } = useLingui();
    const text = completed ? t`Practice ${number} · Complete` : t`Practice ${number}`;

    const handlePress = () => void onSelect(practiceId);

    return <AppButton onPress={handlePress} testID={`${CampaignSelectors.PRACTICE}.${practiceId}`} text={text} variant="secondary" />;
};
