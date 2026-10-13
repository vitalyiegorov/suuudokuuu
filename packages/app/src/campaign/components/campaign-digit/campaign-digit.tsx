import { AppButton } from '@suuudokuuu/ui';

import { CampaignSelectors } from '../../campaign.selectors';

interface Props {
    readonly value: number;
    readonly onInput: (value: number) => void;
    readonly disabled: boolean;
}

export const CampaignDigit = ({ value, onInput, disabled }: Props) => {
    const handlePress = () => void onInput(value);

    return (
        <AppButton
            disabled={disabled}
            onPress={handlePress}
            size="compact"
            testID={`${CampaignSelectors.VALUE}.${value}`}
            text={String(value)}
            variant="secondary"
        />
    );
};
