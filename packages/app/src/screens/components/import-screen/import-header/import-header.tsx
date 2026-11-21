import { useLingui } from '@lingui/react/macro';
import ChevronLeft from 'lucide-react-native/icons/chevron-left';
import ChevronRight from 'lucide-react-native/icons/chevron-right';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { Header } from '../../../../@generic/components/header/header';
import { i18nIsRightToLeftLocale } from '../../../../@generic/utils/i18n-is-right-to-left-locale.util';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportHeaderStyles as styles } from './import-header.styles';

import type { PressableStateCallbackType } from 'react-native';

interface Props {
    readonly isResetVisible: boolean;
    readonly width: number;
    readonly onReset: () => void;
}

export const ImportHeader = ({ isResetVisible, width, onReset }: Props) => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);

    const BackChevron = i18nIsRightToLeftLocale(i18n.locale) ? ChevronRight : ChevronLeft;
    const containerStyles = [styles.container, { width }];
    const getResetStyles = ({ pressed }: PressableStateCallbackType) => [styles.reset, pressed && styles.resetPressed];

    return (
        <View collapsable={false} style={containerStyles}>
            <View style={styles.resetSlot}>
                {isResetVisible ? (
                    <Pressable
                        accessibilityLabel={t`Back`}
                        accessibilityRole="button"
                        onPress={onReset}
                        style={getResetStyles}
                        testID={ImportScreenSelectors.ResetButton}
                    >
                        <BackChevron color={theme.colors.text.primary} size={28} strokeWidth={2.5} />
                    </Pressable>
                ) : null}
            </View>
            <Header
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                numberOfLines={1}
                style={styles.title}
                testID={ImportScreenSelectors.Title}
                text={t`Import a puzzle`}
            />
        </View>
    );
};
