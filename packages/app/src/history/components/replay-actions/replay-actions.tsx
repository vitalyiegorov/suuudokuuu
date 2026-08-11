import { t } from '@lingui/core/macro';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { use } from 'react';
import { Pressable } from 'react-native';

import { HeaderBackButtonGlyphSize } from '../../../@generic/components/header-back-button/constant/header-back-button.constant';
import { HeaderBackButtonStyles } from '../../../@generic/components/header-back-button/header-back-button.styles';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayActionsSelectors } from './replay-actions.selectors';

export const ReplayActions = () => {
    const { theme } = use(ThemeContext);
    const router = useRouter();

    const handleBack = () => (router.canGoBack() ? void router.back() : void router.replace('/history'));

    return (
        <Pressable
            accessibilityLabel={t`Back`}
            accessibilityRole="button"
            onPress={handleBack}
            style={HeaderBackButtonStyles.container}
            testID={ReplayActionsSelectors.BackButton}
        >
            <ChevronLeft color={theme.colors.text.primary} size={HeaderBackButtonGlyphSize} strokeWidth={2.5} />
        </Pressable>
    );
};
