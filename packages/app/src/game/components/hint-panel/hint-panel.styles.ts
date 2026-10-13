import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { gameGetHintFooterHeight } from '../../utils/game-get-hint-footer-height.util';

import type { EdgeInsets } from 'react-native-safe-area-context';

const hintPanelMaxWidth = 480;
const hintPanelControlSize = 44;

const dotSize = 6;
const dotActiveSize = 8;

export const HintPanelStyles = StyleSheet.create((theme, rt) => ({
    region: (controlsTop: number, insets: EdgeInsets) => {
        const isWideLayout = appLayoutScreenIsWide(rt.screen);

        return {
            bottom: Math.max(insets.bottom, theme.spacing.md) + theme.spacing.md - (isWideLayout ? 0 : rt.insets.bottom + theme.spacing.xs),
            justifyContent: 'flex-end',
            left: isWideLayout ? 0 : insets.left + theme.spacing.md,
            position: 'absolute',
            right: isWideLayout ? 0 : insets.right + theme.spacing.md,
            top: isWideLayout ? controlsTop : controlsTop + theme.spacing.sm,
            zIndex: 10
        };
    },
    container: {
        alignSelf: 'center',
        flexShrink: 1,
        minHeight: 0,
        borderCurve: 'continuous',
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        gap: theme.spacing.xs,
        maxWidth: hintPanelMaxWidth,
        padding: theme.spacing.md,
        width: '100%',
        overflow: 'hidden'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0
    },
    dismissButton: {
        height: hintPanelControlSize,
        width: hintPanelControlSize
    },
    technique: {
        color: theme.colors.text.hint,
        flex: 1,
        fontSize: theme.typography.size.xs,
        fontWeight: '900',
        letterSpacing: 0.6,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    actions: {
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm,
        marginTop: 'auto'
    },
    footerButton: {
        borderRadius: theme.radius.pill,
        flex: 1,
        height: gameGetHintFooterHeight(rt.fontScale)
    },
    disabledButton: {
        opacity: 0.4
    },
    dots: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.xs / 2
    },
    dotControl: {
        alignItems: 'center',
        justifyContent: 'center',
        height: hintPanelControlSize,
        width: hintPanelControlSize
    },
    dot: (isSelected: boolean) => ({
        backgroundColor: isSelected ? theme.colors.accent : theme.colors.text.hint,
        borderRadius: theme.radius.pill,
        height: isSelected ? dotActiveSize : dotSize,
        width: isSelected ? dotActiveSize : dotSize
    })
}));
