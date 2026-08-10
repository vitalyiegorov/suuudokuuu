import { StyleSheet } from 'react-native-unistyles';

const SegmentHeight = 5;
const SegmentGap = 1;

export const ReplayMoveQualityStripStyles = StyleSheet.create(theme => ({
    container: {
        flexDirection: 'row',
        gap: SegmentGap,
        width: '100%'
    },
    segment: {
        borderRadius: theme.radius.sm,
        flex: 1,
        height: SegmentHeight
    }
}));
