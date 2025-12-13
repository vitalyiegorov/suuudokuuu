import { StyleSheet } from 'react-native';

const BUTTON_HORIZONTAL_PADDING = 8;
const BUTTON_FONT_SIZE = 14;
const SLIDER_BORDER_RADIUS = 40;
const CONTAINER_BORDER_RADIUS = 20;
const CONTAINER_MARGIN_TOP = 10;

export const ToggleSelectStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: BUTTON_HORIZONTAL_PADDING,
        zIndex: 1
    },
    label: {
        fontSize: BUTTON_FONT_SIZE,
        fontWeight: '500',
        textAlign: 'center'
    },
    selectedLabel: {
        fontWeight: '700'
    },
    slider: {
        borderRadius: SLIDER_BORDER_RADIUS,
        elevation: 3,
        position: 'absolute',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2
    },
    toggleContainer: {
        borderRadius: CONTAINER_BORDER_RADIUS,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: CONTAINER_MARGIN_TOP,
        overflow: 'hidden',
        position: 'relative'
    }
});
