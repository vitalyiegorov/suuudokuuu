import { useLingui } from '@lingui/react/macro';
import LucideTrash from 'lucide-react-native/icons/trash';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { Header } from '../../../../@generic/components/header/header';
import { PanelControlHitSlopConstant } from '../../../../game/constant/panel-control-size.constant';
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
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const containerStyles = [styles.container, { width }];
    const getResetStyles = ({ pressed }: PressableStateCallbackType) => [styles.reset, pressed && styles.resetPressed];

    return (
        <View collapsable={false} style={containerStyles}>
            <Header
                adjustsFontSizeToFit
                minimumFontScale={0.7}
                numberOfLines={1}
                style={styles.title}
                testID={ImportScreenSelectors.Title}
                text={t`Import a puzzle`}
            />
            <View style={styles.resetSlot}>
                {isResetVisible ? (
                    <Pressable
                        accessibilityLabel={t`Clear`}
                        accessibilityRole="button"
                        hitSlop={PanelControlHitSlopConstant}
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
