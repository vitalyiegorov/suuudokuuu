import { Trans, useLingui } from '@lingui/react/macro';
import { useRouter } from 'expo-router';
import { LucideX } from 'lucide-react-native';
import { use } from 'react';
import { View } from 'react-native';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayTopBarSelectors } from './replay-top-bar.selectors';
import { ReplayTopBarStyles as styles } from './replay-top-bar.styles';

export const ReplayTopBar = () => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const router = useRouter();

    const handleReturn = () => (router.canGoBack() ? void router.back() : void router.replace('/history'));
    const accentStyles = [styles.accent, { backgroundColor: theme.colors.numpad.trackFilled }];

    return (
        <View style={styles.container}>
            <View style={styles.titleRow}>
                <View style={accentStyles} />
                <BlackText style={styles.title}>
                    <Trans>Replay</Trans>
                </BlackText>
            </View>

            <AppIconButton
                accessibilityLabel={t`Back`}
                onPress={handleReturn}
                style={styles.closeButton}
                testID={ReplayTopBarSelectors.CloseButton}
            >
                <LucideX color={theme.colors.inkText} size={20} />
            </AppIconButton>
        </View>
    );
};
