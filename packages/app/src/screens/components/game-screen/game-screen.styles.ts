import { StyleSheet } from 'react-native-unistyles';

import { WideLayoutMediaQuery } from '../../../@generic/constants/layout-media-query.constant';
import { GameSidePanelWidthConstant } from '../../../game/constant/board-cell-size.constant';

export const GameScreenStyles = StyleSheet.create((theme, rt) => ({
    container: (isLeftHanded: boolean) => ({
        alignItems: { xs: 'stretch', [WideLayoutMediaQuery]: 'center' },
        flex: 1,
        flexDirection: { xs: 'column', [WideLayoutMediaQuery]: isLeftHanded ? 'row-reverse' : 'row' },
        gap: { xs: theme.spacing.sm, [WideLayoutMediaQuery]: theme.spacing.lg },
        justifyContent: { xs: 'flex-start', [WideLayoutMediaQuery]: 'center' },
        paddingBottom: rt.insets.bottom / 2 + theme.spacing.xs,
        paddingHorizontal: { xs: 0, [WideLayoutMediaQuery]: theme.spacing.md },
        paddingTop: theme.spacing.xs
    }),
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
        aspectRatio: { xs: 'auto', [WideLayoutMediaQuery]: 1 },
        flexGrow: { xs: 1, [WideLayoutMediaQuery]: 0 },
        flexShrink: 1,
        height: { xs: 'auto', [WideLayoutMediaQuery]: '100%' },
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
    panelArea: (boardSize: number) => ({
        alignSelf: 'center',
        flexShrink: 0,
        gap: theme.spacing.sm,
        height: { xs: 'auto', [WideLayoutMediaQuery]: boardSize > 0 ? boardSize : '100%' },
        justifyContent: { xs: 'center', [WideLayoutMediaQuery]: 'space-between' },
        paddingHorizontal: theme.spacing.sm,
        width: { xs: '100%', [WideLayoutMediaQuery]: GameSidePanelWidthConstant }
    }),
    panelInputArea: {
        alignItems: 'center',
        flexShrink: 1,
        gap: { xs: theme.spacing.sm, [WideLayoutMediaQuery]: theme.spacing.xl },
        justifyContent: 'center',
        minHeight: 0
    }
}));
