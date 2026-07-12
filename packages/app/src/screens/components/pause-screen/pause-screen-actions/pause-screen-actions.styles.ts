import { StyleSheet } from 'react-native';

export const PauseScreenActionsStyles = StyleSheet.create({
    container: {
        gap: 10,
        width: '100%'
    },
    primaryButton: {
        maxWidth: '100%',
        width: '100%'
    },
    primaryButtonText: {
        fontSize: 18,
        lineHeight: 23
    },
    secondaryActions: {
        flexDirection: 'row',
        gap: 10,
        maxWidth: '100%',
        width: '100%'
    },
    secondaryButton: {
        flex: 1,
        maxWidth: '100%'
    },
    secondaryButtonText: {
        fontSize: 15,
        lineHeight: 19
    }
});
