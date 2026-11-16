import { useLingui } from '@lingui/react/macro';
import LucideTrash from 'lucide-react-native/icons/trash';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { Header } from '../../../../@generic/components/header/header';
import { ThemeContext } from '../../../../theme/context/theme.context';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportHeaderStyles as styles } from './import-header.styles';

import type { PressableStateCallbackType } from 'react-native';

interface Props {
    readonly isResetVisible: boolean;
    readonly onReset: () => void;
}

export const ImportHeader = ({ isResetVisible, onReset }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const getResetStyles = ({ pressed }: PressableStateCallbackType) => [styles.reset, pressed && styles.resetPressed];

    return (
        <View collapsable={false} style={styles.container}>
            <Header style={styles.title} testID={ImportScreenSelectors.Title} text={t`Import a puzzle`} />
            <View style={styles.resetSlot}>
                {isResetVisible ? (
                    <Pressable
                        accessibilityLabel={t`Clear`}
                        accessibilityRole="button"
                        onPress={onReset}
                        style={getResetStyles}
                        testID={ImportScreenSelectors.ResetButton}
                    >
                        <LucideTrash color={theme.colors.text.hint} size={22} />
                    </Pressable>
                ) : null}
            </View>
        </View>
    );
};
