import { StyleSheet } from 'react-native-unistyles';

import { GameSidePanelWidthConstant } from '../../../game/constant/board-cell-size.constant';

export const GameScreenStyles = StyleSheet.create(theme => ({
    container: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        flex: 1,
        flexDirection: sizeClass === 'wide' ? 'row' : 'column',
        gap: theme.spacing.lg,
        justifyContent: 'center',
        padding: theme.spacing.sm,
        paddingBottom: theme.spacing.lg
    }),
    boardArea: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        flex: sizeClass === 'wide' ? 0 : 1,
        justifyContent: 'center'
    }),
    panelArea: (sizeClass: 'compact' | 'wide') => ({
        width: sizeClass === 'wide' ? GameSidePanelWidthConstant : '100%'
    })
}));
