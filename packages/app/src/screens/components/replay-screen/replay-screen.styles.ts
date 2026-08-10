import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

const ReplayScreenWideWidthMultiplier = 1.4;

export const ReplayScreenStyles = StyleSheet.create((theme, rt) => ({
    container: {
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'column',
        gap: 18,
        maxWidth: appLayoutScreenIsWide(rt.screen)
            ? theme.contentWidth.standard * ReplayScreenWideWidthMultiplier
            : theme.contentWidth.standard,
        paddingBottom: 18,
        paddingHorizontal: 20,
        paddingTop: 18,
        width: '100%'
    },
    content: {
        flex: 1,
        flexDirection: appLayoutScreenIsWide(rt.screen) ? 'row' : 'column',
        gap: 18
    },
    topBar: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flexShrink: 0,
        gap: theme.spacing.md,
        justifyContent: 'space-between'
    },
    fieldWrapper: {
        alignItems: 'center',
        flexGrow: 1,
        flexShrink: 1,
        justifyContent: 'center',
        minHeight: 0,
        minWidth: 0
    },
    controlsColumn: {
        flexGrow: appLayoutScreenIsWide(rt.screen) ? 1 : 0,
        flexShrink: 0,
        gap: 18,
        justifyContent: 'center'
    }
}));
