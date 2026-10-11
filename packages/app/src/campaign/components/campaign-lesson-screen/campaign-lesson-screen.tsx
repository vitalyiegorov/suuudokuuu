import { Trans, useLingui } from '@lingui/react/macro';
import { campaignLessons } from '@suuudokuuu/progress';
import { AppButton } from '@suuudokuuu/ui';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { HeaderBackButton } from '../../../@generic/components/header-back-button/header-back-button';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { campaignStyles as styles } from '../../campaign.styles';
import { useCampaign } from '../../query/use-campaign.query';
import { CampaignAttempt } from '../campaign-attempt/campaign-attempt';
import { CampaignPracticeButton } from '../campaign-practice-button/campaign-practice-button';

export const CampaignLessonScreen = () => {
    const { i18n, t } = useLingui();
    const { technique } = useLocalSearchParams<{ technique: string }>();
    const [practiceId, setPracticeId] = useState<string | null>(null);
    const { progress, unlocked } = useCampaign();
    const lesson = campaignLessons.find(candidate => String(candidate.technique) === technique);
    if (!isDefined(lesson) || !unlocked.some(candidate => candidate === lesson.technique)) {
        return (
            <ChromePage>
                <HeaderBackButton />
                <BlackText>
                    <Trans>Complete the previous lesson to unlock this one.</Trans>
                </BlackText>
            </ChromePage>
        );
    }
    const practice = lesson.practices.find(candidate => candidate.id === practiceId);
    const completedIds = progress.find(row => row.technique === lesson.technique)?.unassistedPracticeIds ?? [];
    const board = practice?.board ?? lesson.exampleBoard;
    const completed = isDefined(practice) && completedIds.includes(practice.id);

    const handleTeaching = () => void setPracticeId(null);

    return (
        <ChromePage>
            <ScrollView contentContainerStyle={styles.content}>
                <HeaderBackButton />
                <BlackText style={styles.heading}>{i18n._(techniqueLabelsConstant[lesson.technique])}</BlackText>
                <BlackText>
                    <Trans>
                        The teaching example explains the technique. Each practice uses a different board and keeps the answer hidden.
                    </Trans>
                </BlackText>
                <AppButton onPress={handleTeaching} text={t`Teaching example`} variant="secondary" />
                {lesson.practices.map((candidate, index) => {
                    const completed = completedIds.includes(candidate.id);
                    const number = index + 1;

                    return (
                        <CampaignPracticeButton
                            completed={completed}
                            key={candidate.id}
                            number={number}
                            onSelect={setPracticeId}
                            practiceId={candidate.id}
                        />
                    );
                })}
                <CampaignAttempt completed={completed} board={board} key={board} practiceId={practice?.id} technique={lesson.technique} />
            </ScrollView>
        </ChromePage>
    );
};
