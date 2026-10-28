import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { gameGetHintFooterHeight } from '../../utils/game-get-hint-footer-height.util';

import type { EdgeInsets } from 'react-native-safe-area-context';

const hintPanelMaxWidth = 480;
const hintPanelControlSize = 44;

const hintPanelStepperButtonMinWidth = 80;

export const HintPanelStyles = StyleSheet.create((theme, rt) => ({
    region: (controlsTop: number, insets: EdgeInsets) => {
        const isWideLayout = appLayoutScreenIsWide(rt.screen);

        return {
            bottom: Math.max(insets.bottom, theme.spacing.md) + theme.spacing.md - (isWideLayout ? 0 : rt.insets.bottom + theme.spacing.xs),
            justifyContent: 'flex-start',
            left: isWideLayout ? 0 : insets.left + theme.spacing.md,
            position: 'absolute',
            right: isWideLayout ? 0 : insets.right + theme.spacing.md,
            top: isWideLayout ? controlsTop : controlsTop + theme.spacing.md,
            zIndex: 10
        };
    },
    container: {
        alignSelf: 'center',
        flexGrow: appLayoutScreenIsWide(rt.screen) ? 0 : 1,
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
    page: {
        flexGrow: 1,
        flexShrink: 1,
        gap: theme.spacing.sm,
        minHeight: 0
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
    titles: { flex: 1 },
    technique: {
        color: theme.colors.text.hint,
        fontSize: theme.typography.size.sm,
        fontWeight: '800',
        textAlign: 'left'
    },
    techniqueChain: {
        color: theme.colors.text.hint,
        fontSize: theme.typography.size.xs,
        fontWeight: '600',
        textAlign: 'left'
    },
    actions: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.sm,
        marginTop: theme.spacing.xs
    },
    footerButton: {
        borderRadius: theme.radius.pill,
        flex: 1,
        height: gameGetHintFooterHeight(rt.fontScale)
    },
    stepperButton: {
        borderRadius: theme.radius.pill,
        height: gameGetHintFooterHeight(rt.fontScale),
        minWidth: hintPanelStepperButtonMinWidth
    },
    disabledButton: {
        opacity: 0.4
    },
    stepperCenter: { alignItems: 'center', flex: 1 },
    stepperLabel: {
        color: theme.colors.text.hint,
        fontSize: theme.typography.size.sm,
        fontVariant: ['tabular-nums'],
        fontWeight: '700',
        textAlign: 'center'
    }
}));
