import { useLingui } from '@lingui/react/macro';
import { useRouter } from 'expo-router';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import { use } from 'react';
import { Pressable } from 'react-native';

import { HeaderBackButtonGlyphSize } from '../../../@generic/components/header-back-button/constant/header-back-button.constant';
import { HeaderBackButtonStyles } from '../../../@generic/components/header-back-button/header-back-button.styles';
import { i18nIsRightToLeftLocale } from '../../../@generic/utils/i18n-is-right-to-left-locale.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ReplayActionsSelectors } from './replay-actions.selectors';

export const ReplayActions = () => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);
    const router = useRouter();

    const handleBack = () => (router.canGoBack() ? void router.back() : void router.replace('/history'));

    const BackChevron = i18nIsRightToLeftLocale(i18n.locale) ? ChevronRight : ChevronLeft;

    return (
        <Pressable
            accessibilityLabel={t`Back`}
            accessibilityRole="button"
            onPress={handleBack}
            style={HeaderBackButtonStyles.container}
            testID={ReplayActionsSelectors.BackButton}
        >
            <BackChevron color={theme.colors.text.primary} size={HeaderBackButtonGlyphSize} strokeWidth={2.5} />
        </Pressable>
    );
};
