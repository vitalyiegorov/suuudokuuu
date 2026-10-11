import { Trans } from '@lingui/react/macro';
import { campaignLessons } from '@suuudokuuu/progress';
import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';
import { ScrollView } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ChromePage } from '../../../@generic/components/chrome-page/chrome-page';
import { HeaderBackButton } from '../../../@generic/components/header-back-button/header-back-button';
import { CampaignSelectors } from '../../campaign.selectors';
import { campaignStyles as styles } from '../../campaign.styles';
import { useCampaign } from '../../query/use-campaign.query';
import { CampaignLessonRow } from '../campaign-lesson-row/campaign-lesson-row';
import { CampaignMasteryRow } from '../campaign-mastery-row/campaign-mastery-row';
import { CampaignStatistics } from '../campaign-statistics/campaign-statistics';

export const CampaignScreen = () => {
    const { mastery } = useCampaign();
    const recordedMastery = mastery.filter(record => record.technique !== SolutionTechniqueEnum.Guess);

    return (
        <ChromePage testID={CampaignSelectors.ROOT}>
            <ScrollView contentContainerStyle={styles.content}>
                <HeaderBackButton />
                <BlackText style={styles.heading}>
                    <Trans>Technique campaign</Trans>
                </BlackText>
                <BlackText>
                    <Trans>Learn one deduction at a time. Solve both practices without help to unlock the next lesson.</Trans>
                </BlackText>
                <BlackText>
                    <Trans>Technique mastery</Trans>
                </BlackText>
                <CampaignStatistics />
                {recordedMastery.length === 0 ? (
                    <BlackText>
                        <Trans>Solve puzzles to build your technique mastery.</Trans>
                    </BlackText>
                ) : null}
                {recordedMastery.map(record => (
                    <CampaignMasteryRow
                        key={record.technique}
                        seenCount={record.seenCount}
                        technique={record.technique}
                        unassistedCount={record.unassistedCount}
                    />
                ))}
                {campaignLessons.map(lesson => (
                    <CampaignLessonRow key={lesson.technique} technique={lesson.technique} />
                ))}
            </ScrollView>
        </ChromePage>
    );
};
