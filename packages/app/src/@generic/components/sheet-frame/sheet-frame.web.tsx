import { useLingui } from '@lingui/react/macro';
import { router } from 'expo-router';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';
import { applyColorAlpha } from '../../utils/apply-color-alpha.util';

import { SheetFrameStyles as styles } from './sheet-frame.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly detents: readonly number[];
}

const SheetBackdropAlpha = 0.4;
const SheetHandleAlpha = 0.3;

export const SheetFrame = ({ children, detents }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const handleClose = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/');
        }
    };

    const [initialDetent = 1] = detents;
    const backdropStyles = [styles.backdrop, { backgroundColor: applyColorAlpha(theme.colors.ink, SheetBackdropAlpha) }];
    const panelStyles = [styles.panel, { backgroundColor: theme.colors.background, height: `${initialDetent * 100}%` as const }];
    const handleStyles = [styles.handle, { backgroundColor: applyColorAlpha(theme.colors.text.primary, SheetHandleAlpha) }];

    return (
        <View style={styles.root}>
            <Pressable accessibilityLabel={t`Close`} onPress={handleClose} style={backdropStyles} />
            <View style={panelStyles}>
                <View style={handleStyles} />
                {children}
            </View>
        </View>
    );
};
