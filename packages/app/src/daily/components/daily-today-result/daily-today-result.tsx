import { useLingui } from '@lingui/react/macro';
import LucideCheck from 'lucide-react-native/icons/check';
import { use } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { getDifficultyMessage } from '../../../@generic/utils/get-difficulty-message.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTodayResultStats } from '../daily-today-result-stats/daily-today-result-stats';

import { DailyTodayResultSelectors } from './daily-today-result.selectors';
import { DailyTodayResultStyles as styles } from './daily-today-result.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';
import type { DailyResultType } from '@suuudokuuu/progress';

const TickIconSize = 13;
const TickStrokeWidth = 3;

interface Props {
    readonly difficulty: DifficultyEnum;
    readonly result: DailyResultType | undefined;
}

export const DailyTodayResult = ({ difficulty, result }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const difficultyLabel = t(getDifficultyMessage(difficulty));
    const tickStyles = [styles.tick, { backgroundColor: applyColorAlpha(theme.colors.accent, 1) }];
    const titleStyles = [styles.title, { color: theme.colors.text.primary }];

    return (
        <View style={styles.root} testID={DailyTodayResultSelectors.Root}>
            <View style={styles.titleRow}>
                <View style={tickStyles}>
                    <LucideCheck color={theme.colors.background} size={TickIconSize} strokeWidth={TickStrokeWidth} />
                </View>

                <BlackText numberOfLines={1} style={titleStyles}>
                    {t`Solved today • ${difficultyLabel}`}
                </BlackText>
            </View>

            {isDefined(result) ? <DailyTodayResultStats result={result} /> : null}
        </View>
    );
};
