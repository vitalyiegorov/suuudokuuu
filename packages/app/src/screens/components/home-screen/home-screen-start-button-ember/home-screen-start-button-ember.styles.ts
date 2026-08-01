import { StyleSheet } from 'react-native-unistyles';

export const HomeScreenStartButtonEmberStyles = StyleSheet.create(theme => ({
    emberButton: {
        backgroundColor: theme.colors.danger,
        borderColor: theme.colors.danger
    },
    emberWrapper: {
        borderRadius: 999,
        width: '100%'
    }
}));
