import { StyleSheet } from 'react-native-unistyles';

const ScrubberThumbSize = 28;
const ScrubberTrackHeight = 10;
const ScrubberHitAreaMinHeight = 44;

export const ReplayScrubberStyles = StyleSheet.create(theme => ({
    hitArea: {
        justifyContent: 'center',
        minHeight: ScrubberHitAreaMinHeight,
        width: '100%'
    },
    track: {
        borderRadius: theme.radius.pill,
        height: ScrubberTrackHeight,
        position: 'relative',
        width: '100%'
    },
    fill: {
        borderRadius: theme.radius.pill,
        bottom: 0,
        left: 0,
        position: 'absolute',
        top: 0
    },
    thumb: {
        borderRadius: ScrubberThumbSize / 2,
        borderWidth: 2,
        height: ScrubberThumbSize,
        marginLeft: -(ScrubberThumbSize / 2),
        position: 'absolute',
        top: (ScrubberTrackHeight - ScrubberThumbSize) / 2,
        width: ScrubberThumbSize
    }
}));
