import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryTechniqueGlyph } from '../history-technique-glyph/history-technique-glyph';

import { ReplayHardestMomentSelectors } from './replay-hardest-moment.selectors';
import { ReplayHardestMomentStyles as styles } from './replay-hardest-moment.styles';

import type { ReplayHardestStepInterface } from '../../interfaces/replay-hardest-step.interface';

const GlyphSize = 24;
const GlyphGap = 2;

interface Props {
    readonly hardestStep: ReplayHardestStepInterface | null;
    readonly onSeekToStep: (stepNumber: number) => void;
}

export const ReplayHardestMoment = ({ hardestStep, onSeekToStep }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    if (!isDefined(hardestStep)) {
        return null;
    }

    const techniqueLabel = _(techniqueLabelsConstant[hardestStep.technique]);
    const handlePress = () => void onSeekToStep(hardestStep.stepNumber);

    const containerStyles = [styles.container, { backgroundColor: theme.colors.candidate.fill, borderColor: theme.colors.surface.border }];
    const captionStyles = [styles.caption, { color: theme.colors.text.hint }];
    const valueStyles = [styles.value, { color: theme.colors.text.primary }];

    return (
        <Pressable accessibilityRole="button" onPress={handlePress} style={containerStyles} testID={ReplayHardestMomentSelectors.Root}>
            <HistoryTechniqueGlyph gap={GlyphGap} size={GlyphSize} technique={hardestStep.technique} />

            <View style={styles.textColumn}>
                <BlackText style={captionStyles}>
                    <Trans>Hardest moment</Trans>
                </BlackText>
                <BlackText numberOfLines={1} style={valueStyles}>
                    {techniqueLabel}
                </BlackText>
            </View>
        </Pressable>
    );
};
