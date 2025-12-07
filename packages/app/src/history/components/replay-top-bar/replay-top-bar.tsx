import { useLingui } from '@lingui/react/macro';
import { useRouter } from 'expo-router';
import { LucideX } from 'lucide-react-native';
import { use } from 'react';
import { View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayTopBarStyles as styles } from './replay-top-bar.styles';

export const ReplayTopBar = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const router = useRouter();

    const handleReturn = () => (router.canGoBack() ? void router.back() : void router.replace('/history'));

    return (
        <View style={styles.container}>
            <BlackText style={styles.title}>{t`Replay`}</BlackText>
            <BlackButton onPress={handleReturn} style={styles.closeButton}>
                <LucideX color={theme.colors.label.inverted} size={20} />
            </BlackButton>
        </View>
    );
};
