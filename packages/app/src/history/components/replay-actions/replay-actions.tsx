import { useLingui } from '@lingui/react/macro';
import { useRouter } from 'expo-router';
import { LucideChevronLeft } from 'lucide-react-native';
import { use } from 'react';
import { View } from 'react-native';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayActionsSelectors } from './replay-actions.selectors';
import { ReplayActionsStyles as styles } from './replay-actions.styles';

export const ReplayActions = () => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();
    const router = useRouter();

    const handleBack = () => (router.canGoBack() ? void router.back() : void router.replace('/history'));
    const actionIconColor = theme.colors.surface.raisedText;

    return (
        <View style={styles.actions}>
            <AppIconButton
                accessibilityLabel={t`Back`}
                hitSlop={10}
                onPress={handleBack}
                style={styles.button}
                testID={ReplayActionsSelectors.BackButton}
                variant="inverted"
            >
                <LucideChevronLeft color={actionIconColor} />
            </AppIconButton>
        </View>
    );
};
