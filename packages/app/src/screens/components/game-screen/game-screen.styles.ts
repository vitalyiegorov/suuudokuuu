import { StyleSheet } from 'react-native-unistyles';

import { WideLayoutMediaQuery } from '../../../@generic/constants/layout-media-query.constant';
import { GameSidePanelWidthConstant } from '../../../game/constant/board-cell-size.constant';

export const GameScreenStyles = StyleSheet.create((theme, rt) => ({
    container: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: { xs: 'column', [WideLayoutMediaQuery]: 'row' },
        gap: theme.spacing.sm,
        paddingBottom: rt.insets.bottom / 2 + theme.spacing.xs,
        paddingTop: theme.spacing.xs
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
        flexGrow: 1,
        flexShrink: 1,
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
        minHeight: 0
    },
    panelArea: {
        flexShrink: 0,
        gap: theme.spacing.sm,
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.sm,
        width: { xs: '100%', [WideLayoutMediaQuery]: GameSidePanelWidthConstant }
    }
}));
