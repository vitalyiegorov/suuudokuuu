import { StyleSheet } from 'react-native';

export const HomeStyles = StyleSheet.create({
    backButton: {
        marginTop: 20
    },
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    header: {
        fontFamily: 'Inter_700Bold',
        fontSize: 22,
        marginBottom: 20
    },
    startButton: {
        backgroundColor: '#000',
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    startButtonText: {
        color: 'white',
        fontFamily: 'Inter_500Medium'
    }
});
