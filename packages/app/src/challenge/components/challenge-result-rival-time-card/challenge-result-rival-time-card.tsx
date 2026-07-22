import { useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { LucideFlag } from 'lucide-react-native';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { ChallengeResultRivalTimeCardStyles as styles } from './challenge-result-rival-time-card.styles';

const ICON_SIZE = 24;

interface Props {
    readonly rivalTimeText: string;
}

export const ChallengeResultRivalTimeCard = ({ rivalTimeText }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const labelStyle = [styles.label, { color: theme.colors.white05 }];
    const valueStyle = [styles.value, { color: theme.colors.label.inverted }];
    const iconWrapStyle = [styles.iconWrap, { backgroundColor: theme.colors.white05 }];

    return (
        <AppSurfaceCard style={styles.card} variant="inverted">
            <View style={styles.textColumn}>
                <Text allowFontScaling={false} style={labelStyle}>
                    {t`Rival's time to beat`}
                </Text>
                <Text allowFontScaling={false} style={valueStyle}>
                    {rivalTimeText}
                </Text>
            </View>
            <View style={iconWrapStyle}>
                <LucideFlag color={theme.colors.label.inverted} size={ICON_SIZE} strokeWidth={2} />
            </View>
        </AppSurfaceCard>
    );
};
