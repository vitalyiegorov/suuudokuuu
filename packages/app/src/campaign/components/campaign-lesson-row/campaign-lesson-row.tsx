import { Trans, useLingui } from '@lingui/react/macro';
import { requiredUnassistedPracticeCount } from '@suuudokuuu/progress';
import { AppButton } from '@suuudokuuu/ui';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { CampaignSelectors } from '../../campaign.selectors';
import { campaignStyles as styles } from '../../campaign.styles';
import { useCampaign } from '../../query/use-campaign.query';
import { CampaignMasteryRow } from '../campaign-mastery-row/campaign-mastery-row';

import type { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

interface Props {
    readonly technique: SolutionTechniqueEnum;
}

export const CampaignLessonRow = ({ technique }: Props) => {
    const { t } = useLingui();
    const router = useRouter();
    const { mastery, progress, unlocked } = useCampaign();
    const record = mastery.find(row => row.technique === technique);
    const seenCount = record?.seenCount ?? 0;
    const unassistedCount = record?.unassistedCount ?? 0;
    const practiceCount = progress.find(row => row.technique === technique)?.unassistedPracticeIds.length ?? 0;
    const isLocked = !unlocked.some(candidate => candidate === technique);
    const actionText = isLocked ? t`Locked` : t`Open lesson`;

    const handleOpen = () => void router.push(`/campaign/${technique}`);

    return (
        <View style={styles.card} testID={`${CampaignSelectors.LESSON}.${technique}`}>
            <CampaignMasteryRow seenCount={seenCount} technique={technique} unassistedCount={unassistedCount} />
            <BlackText>
                <Trans>
                    Practices: {practiceCount}/{requiredUnassistedPracticeCount}
                </Trans>
            </BlackText>
            <AppButton accessibilityRole="button" disabled={isLocked} onPress={handleOpen} text={actionText} variant="secondary" />
        </View>
    );
};
