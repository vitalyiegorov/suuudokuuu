import { appLayoutScreenIsWide } from '@suuudokuuu/ui';
import { StyleSheet } from 'react-native-unistyles';

const CompactContainerHorizontalPadding = 16;

export const ChallengeRaceHudStyles = StyleSheet.create((_theme, rt) => ({
    card: {
        gap: 9,
        paddingVertical: 4,
        width: '100%'
    },
    container: {
        marginBottom: 10,
        paddingHorizontal: appLayoutScreenIsWide(rt.screen) ? 0 : CompactContainerHorizontalPadding,
        width: '100%'
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
        minHeight: 30
    }
}));
