import { StyleSheet } from 'react-native-unistyles';

import { GameSidePanelWidthConstant } from '../../../../game/constant/board-cell-size.constant';

export const GameSidePanelStyles = StyleSheet.create(theme => ({
    panel: {
        gap: theme.spacing.md,
        width: GameSidePanelWidthConstant
    },
    statusBlock: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'space-between'
    },
    numpad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        justifyContent: 'center'
    },
    toolsRowSpacer: {
        height: theme.spacing.xl
    },
    inputControls: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center'
    },
    actions: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        justifyContent: 'center'
    }
}));
