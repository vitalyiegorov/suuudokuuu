import { useLingui } from '@lingui/react/macro';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { use } from 'react';
import { Pressable } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { HeaderBackButtonGlyphSize } from './constant/header-back-button.constant';
import { HeaderBackButtonSelectors } from './header-back-button.selectors';
import { HeaderBackButtonStyles as styles } from './header-back-button.styles';

export const HeaderBackButton = () => {
    const { t } = useLingui();
    const router = useRouter();
    const { theme } = use(ThemeContext);

    const handlePress = () => {
        if (router.canGoBack()) {
            router.back();

            return;
        }

        router.replace('/');
    };

    return (
        <Pressable
            accessibilityLabel={t`Back`}
            accessibilityRole="button"
            onPress={handlePress}
            style={styles.container}
            testID={HeaderBackButtonSelectors.Root}
        >
            <ChevronLeft color={theme.colors.text.primary} size={HeaderBackButtonGlyphSize} strokeWidth={2.5} />
        </Pressable>
    );
};
