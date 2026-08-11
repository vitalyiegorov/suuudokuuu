import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { techniqueLabelsConstant } from '../../../@generic/constants/technique-labels.constant';
import { formatSeRatingValue } from '../../../@generic/utils/format-se-rating-value.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { HistoryTechniqueTile } from '../history-technique-tile/history-technique-tile';

import { HistoryTechniqueHeroStyles as styles } from './history-technique-hero.styles';

import type { TechniqueUsageInterface } from '../../interfaces/technique-usage.interface';

interface Props {
    readonly label: string;
    readonly usage: TechniqueUsageInterface;
    readonly testID?: string;
}

export const HistoryTechniqueHero = ({ label, usage, testID }: Props) => {
    const { _ } = useLingui();
    const { theme } = use(ThemeContext);

    const techniqueLabel = _(techniqueLabelsConstant[usage.technique]);
    const seValueText = formatSeRatingValue(usage.seValue, false);
    const labelStyles = [styles.label, { color: theme.colors.text.hint }];
    const nameStyles = [styles.name, { color: theme.colors.text.primary }];
    const seValueStyles = [styles.seValue, { color: theme.colors.text.hint }];

    return (
        <View style={styles.container} testID={testID}>
            <BlackText style={labelStyles}>{label}</BlackText>

            <View style={styles.row}>
                <HistoryTechniqueTile testID={`${testID}.Tile`} usage={usage} />

                <View style={styles.details}>
                    <BlackText numberOfLines={2} style={nameStyles}>
                        {techniqueLabel}
                    </BlackText>
                    <BlackText style={seValueStyles}>
                        <Trans>SE {seValueText}</Trans>
                    </BlackText>
                </View>
            </View>
        </View>
    );
};
