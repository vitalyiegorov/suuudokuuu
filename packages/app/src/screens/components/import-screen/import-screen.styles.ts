import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from './constants/import-compact-frame-height.constant';

export const ImportScreenStyles = StyleSheet.create((theme, rt) => {
    const isCompact = rt.screen.height < ImportCompactFrameHeightConstant;

    return {
        content: {
            alignItems: 'center',
            alignSelf: 'center',
            flexGrow: 1,
            justifyContent: 'center',
            maxWidth: '100%',
            paddingVertical: isCompact ? theme.spacing.xs : theme.spacing.md
        },
        sourcesContent: { paddingBottom: theme.spacing.xxl * 2 },
        scroll: { flexGrow: 1, flexBasis: 0, flexShrink: 1, minHeight: 0 },
        statusSlot: {
            alignSelf: 'stretch',
            flexShrink: 0,
            gap: theme.spacing.xs,
            paddingTop: isCompact ? theme.spacing.sm : theme.spacing.md
        }
    };
});
