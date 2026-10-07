import { plural } from '@lingui/core/macro';
import { useLingui } from '@lingui/react/macro';
import { use } from 'react';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { DailyBestStreakSelectors } from './daily-best-streak.selectors';
import { DailyBestStreakStyles as styles } from './daily-best-streak.styles';

interface Props {
    readonly bestStreak: number;
}

export const DailyBestStreak = ({ bestStreak }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const rootStyles = [styles.root, { color: theme.colors.text.hint }];

    return (
        <BlackText style={rootStyles} testID={DailyBestStreakSelectors.Root}>
            {t({ message: plural(bestStreak, { one: 'Best streak: # day', other: 'Best streak: # days' }) })}
        </BlackText>
    );
};
