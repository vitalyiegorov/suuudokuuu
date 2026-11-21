import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';
import { ImportCompactPressHeightConstant } from '../constants/import-compact-press-height.constant';
import { ImportRegularPressHeightConstant } from '../constants/import-regular-press-height.constant';

export const ImportCellPadStyles = StyleSheet.create((theme, rt) => ({
    label: { textAlign: 'center', color: theme.colors.surface.subtleText, fontSize: theme.typography.size.md, fontWeight: '700' },
    button: {
        flexBasis: 0,
        flexGrow: 1,
        height: rt.screen.height < ImportCompactFrameHeightConstant ? ImportCompactPressHeightConstant : ImportRegularPressHeightConstant,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.xs,
        justifyContent: 'center'
    },
    surface: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderRadius: theme.radius.pill,
        borderWidth: 1,
        borderColor: theme.colors.surface.border,
        backgroundColor: theme.colors.surface.subtle
    },
    firstButton: { paddingStart: 0 },
    lastButton: { paddingEnd: 0 },
    row: { flexDirection: 'row', width: '100%' },
    pressed: { opacity: 0.85 },
    pad: { width: '100%' },
    disabledPad: { opacity: 0.5 }
}));
