import { t } from '@lingui/core/macro';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { use } from 'react';
import { Pressable } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { HeaderBackButtonSelectors } from './header-back-button.selectors';
import { HeaderBackButtonStyles as styles } from './header-back-button.styles';

export const HeaderBackButton = () => {
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
            <ChevronLeft color={theme.colors.label.main} size={30} strokeWidth={2.5} />
        </Pressable>
    );
};
