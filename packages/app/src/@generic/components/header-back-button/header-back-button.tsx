import { useLingui } from '@lingui/react/macro';
import { useRouter } from 'expo-router';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import { use } from 'react';
import { Pressable } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { i18nIsRightToLeftLocale } from '../../utils/i18n-is-right-to-left-locale.util';

import { HeaderBackButtonGlyphSize } from './constant/header-back-button.constant';
import { HeaderBackButtonSelectors } from './header-back-button.selectors';
import { HeaderBackButtonStyles as styles } from './header-back-button.styles';

export const HeaderBackButton = () => {
    const { i18n, t } = useLingui();
    const router = useRouter();
    const { theme } = use(ThemeContext);

    const handlePress = () => {
        if (router.canGoBack()) {
            router.back();

            return;
        }

        router.replace('/');
    };

    const BackChevron = i18nIsRightToLeftLocale(i18n.locale) ? ChevronRight : ChevronLeft;

    return (
        <Pressable
            accessibilityLabel={t`Back`}
            accessibilityRole="button"
            onPress={handlePress}
            style={styles.container}
            testID={HeaderBackButtonSelectors.Root}
        >
            <BackChevron color={theme.colors.text.primary} size={HeaderBackButtonGlyphSize} strokeWidth={2.5} />
        </Pressable>
    );
};
