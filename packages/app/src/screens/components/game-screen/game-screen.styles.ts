import { StyleSheet } from 'react-native-unistyles';

import { WideLayoutMediaQuery } from '../../../@generic/constants/layout-media-query.constant';
import { GameSidePanelWidthConstant } from '../../../game/constant/board-cell-size.constant';

export const GameScreenStyles = StyleSheet.create((theme, rt) => ({
    container: {
        alignItems: 'stretch',
        flex: 1,
        flexDirection: { xs: 'column', [WideLayoutMediaQuery]: 'row' },
        gap: theme.spacing.md,
        padding: theme.spacing.sm,
        paddingBottom: rt.insets.bottom + theme.spacing.md,
        paddingTop: rt.insets.top
    },
    topBar: {
        alignItems: 'center',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.md,
        justifyContent: 'space-between'
    },
    boardArea: {
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'center',
        minHeight: 0,
        minWidth: 0
    },
    panelArea: {
        flexShrink: 0,
        gap: theme.spacing.md,
        justifyContent: 'center',
        width: { xs: '100%', [WideLayoutMediaQuery]: GameSidePanelWidthConstant }
    }
}));
