import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

import { GameSidePanelWidthConstant } from '../../../game/constant/board-cell-size.constant';

export const GameScreenStyles = StyleSheet.create((theme, rt) => ({
    container: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: 'column',
        gap: theme.spacing.sm,
        justifyContent: 'flex-start',
        paddingBottom: rt.insets.bottom / 2 + theme.spacing.xs,
        paddingHorizontal: appLayoutScreenIsWide(rt.screen) ? theme.spacing.md : 0,
        paddingTop: theme.spacing.xs
    },
    gameRow: (isLeftHanded: boolean) => {
        const isWideLayout = appLayoutScreenIsWide(rt.screen);
        const wideGameRowFlexDirection = isLeftHanded ? 'row-reverse' : 'row';

        return {
            alignItems: isWideLayout ? 'center' : 'stretch',
            flexDirection: isWideLayout ? wideGameRowFlexDirection : 'column',
            flexGrow: 1,
            flexShrink: 1,
            gap: isWideLayout ? theme.spacing.lg : theme.spacing.sm,
            justifyContent: isWideLayout ? 'center' : 'flex-start',
            minHeight: 0
        };
    },
    topBar: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.md,
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.sm
    },
    boardArea: {
        alignItems: 'center',
        aspectRatio: appLayoutScreenIsWide(rt.screen) ? 1 : 'auto',
        flexGrow: appLayoutScreenIsWide(rt.screen) ? 0 : 1,
        flexShrink: 1,
        height: appLayoutScreenIsWide(rt.screen) ? '100%' : 'auto',
        justifyContent: 'center',
        minHeight: 0,
        minWidth: 0
    },
    boardSpacer: {
        flexGrow: 1,
        flexShrink: 1
    },
    toolsSlot: {
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'center',
        minHeight: 0,
        paddingTop: theme.spacing.sm
    },
    panelArea: (boardSize: number) => {
        const isWideLayout = appLayoutScreenIsWide(rt.screen);
        const widePanelAreaHeight = boardSize > 0 ? boardSize : '100%';

        return {
            alignSelf: 'center',
            flexShrink: 0,
            gap: theme.spacing.sm,
            height: isWideLayout ? widePanelAreaHeight : 'auto',
            justifyContent: isWideLayout ? 'space-between' : 'center',
            paddingHorizontal: theme.spacing.sm,
            width: isWideLayout ? GameSidePanelWidthConstant : '100%'
        };
    },
    panelInputArea: {
        alignItems: 'center',
        flexShrink: 1,
        gap: appLayoutScreenIsWide(rt.screen) ? theme.spacing.xl : theme.spacing.sm,
        justifyContent: 'center',
        minHeight: 0
    }
}));
