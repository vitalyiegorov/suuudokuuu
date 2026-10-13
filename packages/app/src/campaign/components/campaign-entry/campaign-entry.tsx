import { useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { useRouter } from 'expo-router';

import { CampaignSelectors } from '../../campaign.selectors';

export const CampaignEntry = () => {
    const { t } = useLingui();
    const router = useRouter();

    const handlePress = () => void router.push('/campaign');

    return <AppButton onPress={handlePress} testID={CampaignSelectors.ENTRY} text={t`Learn techniques`} variant="secondary" />;
};
