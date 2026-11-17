import { Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ImportCompactFrameHeightConstant } from '../constants/import-compact-frame-height.constant';

export const ImportLegendStyles = StyleSheet.create((theme, rt) => ({
    legend: {
        alignItems: 'center',
        gap: theme.spacing.md,
        flexShrink: 0,
        marginTop:
            rt.screen.height < ImportCompactFrameHeightConstant
                ? theme.spacing.xs + (Platform.OS === 'web' ? theme.spacing.xs / 2 : 0)
                : theme.spacing.md
    },
    samples: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: theme.spacing.lg, rowGap: theme.spacing.sm },
    line: { color: theme.colors.text.hint, fontSize: theme.typography.size.sm, textAlign: 'center' }
}));
