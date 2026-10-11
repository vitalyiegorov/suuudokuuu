import { Trans } from '@lingui/react/macro';
import { campaignLessons } from '@suuudokuuu/progress';
import * as AsyncResult from 'effect/reactivity/AsyncResult';
import { ScrollView } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { HeaderBackButton } from '../../../@generic/components/header-back-button/header-back-button';
import { CampaignSelectors } from '../../campaign.selectors';
import { campaignStyles as styles } from '../../campaign.styles';
import { useCampaign } from '../../query/use-campaign.query';
import { CampaignLessonRow } from '../campaign-lesson-row/campaign-lesson-row';
import { CampaignMasteryRow } from '../campaign-mastery-row/campaign-mastery-row';

export const CampaignScreen = () => {
    const campaign = useCampaign();
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
    const { mastery } = campaign.value;

    return (
        <ChromePage testID={CampaignSelectors.ROOT}>
            <ScrollView contentContainerStyle={styles.content}>
                <HeaderBackButton />
                <BlackText style={styles.heading}>
                    <Trans>Technique campaign</Trans>
                </BlackText>
                <BlackText>
                    <Trans>Learn one deduction at a time. Solve every practice in a lesson without help to unlock the next lesson.</Trans>
                </BlackText>
                <BlackText>
                    <Trans>Technique mastery</Trans>
                </BlackText>
                {mastery.length === 0 ? (
                    <BlackText>
                        <Trans>Solve puzzles to build your technique mastery.</Trans>
                    </BlackText>
                ) : null}
                {mastery.map(record => (
                    <CampaignMasteryRow
                        key={record.technique}
                        seenCount={record.seenCount}
                        technique={record.technique}
                        unassistedCount={record.unassistedCount}
                    />
                ))}
                {campaignLessons.map(lesson => (
                    <CampaignLessonRow key={lesson.technique} lesson={lesson} />
                ))}
            </ScrollView>
        </ChromePage>
    );
};
