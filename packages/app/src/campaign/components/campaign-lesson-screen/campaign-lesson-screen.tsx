import { Trans, useLingui } from '@lingui/react/macro';
import { campaignLessons } from '@suuudokuuu/progress';
import { AppButton } from '@suuudokuuu/ui';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { Redirect, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { HeaderBackButton } from '../../../@generic/components/header-back-button/header-back-button';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { campaignStyles as styles } from '../../campaign.styles';
import { useCampaign } from '../../query/use-campaign.query';
import { CampaignPracticeButton } from '../campaign-practice-button/campaign-practice-button';
import { CampaignPractice } from '../campaign-practice/campaign-practice';
import { CampaignTeaching } from '../campaign-teaching/campaign-teaching';

export const CampaignLessonScreen = () => {
    const { i18n, t } = useLingui();
    const { technique } = useLocalSearchParams<{ technique: string }>();
    const [practiceId, setPracticeId] = useState<string | null>(null);
    const [attemptNumber, setAttemptNumber] = useState(0);
    const campaign = useCampaign();
    const lesson = campaignLessons.find(candidate => String(candidate.technique) === technique);
    const handleSelectPractice = (selectedPracticeId: string) => {
        setPracticeId(selectedPracticeId);
        setAttemptNumber(previous => previous + 1);
    };
    const handleTeaching = () => void setPracticeId(null);
    const handleRetry = () => void setAttemptNumber(previous => previous + 1);
    if (!isDefined(lesson)) {
        return <Redirect href="/campaign" />;
    }
    if (AsyncResult.isFailure(campaign)) {
        return (
            <BlackText>
                <Trans>Campaign progress could not be loaded.</Trans>
            </BlackText>
        );
    }
    if (!AsyncResult.isSuccess(campaign)) {
        return null;
    }
    const { progress, unlocked } = campaign.value;
    if (!unlocked.includes(lesson.technique)) {
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
    const lessonProgress = progress.find(row => row.technique === lesson.technique);
    const completedIds = lessonProgress?.completedPracticeIds ?? [];

    return (
        <ChromePage>
            <ScrollView contentContainerStyle={styles.content}>
                <HeaderBackButton />
                <BlackText style={styles.heading}>{i18n._(techniqueLabelsConstant[lesson.technique])}</BlackText>
                <BlackText>
                    <Trans>
                        The teaching example explains the technique. Practices transform the teaching board and change its digits while
                        keeping the answer hidden.
                    </Trans>
                </BlackText>
                <AppButton onPress={handleTeaching} text={t`Teaching example`} variant="secondary" />
                {lesson.practices.map((candidate, index) => (
                    <CampaignPracticeButton
                        completed={completedIds.includes(candidate.id)}
                        key={candidate.id}
                        position={index}
                        onSelect={handleSelectPractice}
                        practiceId={candidate.id}
                    />
                ))}
                {isDefined(practice) ? (
                    <CampaignPractice
                        board={practice.board}
                        key={`${practice.id}.${attemptNumber}`}
                        onRetry={handleRetry}
                        practiceId={practice.id}
                        technique={lesson.technique}
                    />
                ) : (
                    <CampaignTeaching board={lesson.exampleBoard} key={lesson.technique} technique={lesson.technique} />
                )}
            </ScrollView>
        </ChromePage>
    );
};
