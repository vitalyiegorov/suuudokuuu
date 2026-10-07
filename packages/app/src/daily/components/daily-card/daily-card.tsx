import { use } from 'react';
import { View } from 'react-native';

import { applyColorAlpha } from '../../../@generic/utils/apply-color-alpha.util';
import { ThemeContext } from '../../../theme/context/theme.context';
import { DailyTintAlpha } from '../../constants/daily-tint-alpha.constant';

import { DailyCardStyles as styles } from './daily-card.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
}

export const DailyCard = ({ children }: Props) => {
    const { theme } = use(ThemeContext);

    const cardStyles = [
        styles.card,
        {
            backgroundColor: applyColorAlpha(theme.colors.text.primary, DailyTintAlpha.surface),
            borderColor: applyColorAlpha(theme.colors.text.primary, DailyTintAlpha.divider)
        }
    ];

    return <View style={cardStyles}>{children}</View>;
};
