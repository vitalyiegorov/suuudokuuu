import { use } from 'react';
import { View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';
import { DailyWeekStrip } from '../daily-week-strip/daily-week-strip';

import { DailyWeekCardStyles as styles } from './daily-week-card.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children?: ReactNode;
    readonly completedDayNumbers: readonly number[];
    readonly todayDayNumber: number;
}

export const DailyWeekCard = ({ children, completedDayNumbers, todayDayNumber }: Props) => {
    const { theme } = use(ThemeContext);

    const dividerColor = applyColorAlpha(theme.colors.text.primary, DailyTintAlpha.divider);
    const cardStyles = [
        styles.card,
        { backgroundColor: applyColorAlpha(theme.colors.text.primary, DailyTintAlpha.surface), borderColor: dividerColor }
    ];
    const footerStyles = [styles.footer, { borderTopColor: dividerColor }];
    const footer = isDefined(children) ? <View style={footerStyles}>{children}</View> : null;

    return (
        <View style={cardStyles}>
            <DailyWeekStrip completedDayNumbers={completedDayNumbers} todayDayNumber={todayDayNumber} />

            {footer}
        </View>
    );
};
