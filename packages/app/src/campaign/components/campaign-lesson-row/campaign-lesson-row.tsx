import { Trans, useLingui } from '@lingui/react/macro';
import { getLessonUnassistedPracticeCount } from '@suuudokuuu/progress';
import { AppButton } from '@suuudokuuu/ui';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { useRouter } from 'expo-router';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { CampaignSelectors } from '../../campaign.selectors';
import { campaignStyles as styles } from '../../campaign.styles';
import { useCampaign } from '../../query/use-campaign.query';

import type { campaignLessons } from '@suuudokuuu/progress';

interface Props {
    readonly lesson: (typeof campaignLessons)[number];
}

export const CampaignLessonRow = ({ lesson }: Props) => {
    const { i18n, t } = useLingui();
    const router = useRouter();
    const campaign = useCampaign();
    if (!AsyncResult.isSuccess(campaign)) {
        return null;
    }
    const { progress, unlocked } = campaign.value;
    const completedIds = progress.find(row => row.technique === lesson.technique)?.completedPracticeIds ?? [];
    const completedCount = lesson.practices.filter(practice => completedIds.includes(practice.id)).length;
    const unassistedCount = getLessonUnassistedPracticeCount(lesson, progress);
    const isLocked = !unlocked.includes(lesson.technique);
    const handleOpen = () => void router.push(`/campaign/${lesson.technique}`);
    const actionText = isLocked ? t`Locked` : t`Open lesson`;
    const practiceCount = lesson.practices.length;
    const statusText = unassistedCount === practiceCount ? t`Mastered` : t`In progress`;

    return (
        <View style={styles.card} testID={`${CampaignSelectors.LESSON}.${lesson.technique}`}>
            <BlackText>{i18n._(techniqueLabelsConstant[lesson.technique])}</BlackText>
            <BlackText>{statusText}</BlackText>
            <BlackText>
                <Trans>
                    Completed practices: {completedCount}/{practiceCount}
                </Trans>
            </BlackText>
            <BlackText>
                <Trans>
                    Unassisted practices: {unassistedCount}/{practiceCount}
                </Trans>
            </BlackText>
            <AppButton accessibilityRole="button" disabled={isLocked} onPress={handleOpen} text={actionText} variant="secondary" />
        </View>
    );
};
