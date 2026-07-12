import { StyleSheet } from 'react-native-unistyles';

export const PrivacyPolicyScreenStyles = StyleSheet.create(theme => ({
    content: {
        alignItems: 'center',
        paddingHorizontal: 20
    },
    scrollView: (sizeClass: 'compact' | 'wide') => ({
        width: '100%',
        ...(sizeClass === 'wide' && { maxWidth: theme.contentWidth.standard })
    })
}));
