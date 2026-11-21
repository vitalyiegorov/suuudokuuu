import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactPressHeightConstant } from '../constants/import-compact-press-height.constant';

export const ImportEntryKindStyles = StyleSheet.create(theme => ({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        height: ImportCompactPressHeightConstant,
        maxWidth: 300,
        width: '100%'
    },
    track: {
        ...StyleSheet.absoluteFill,
        top: theme.spacing.xs,
        bottom: theme.spacing.xs,
        backgroundColor: theme.colors.surface.group,
        borderColor: theme.colors.surface.border,
        borderWidth: 1,
        borderRadius: theme.radius.pill
    }
}));
