import { StyleSheet } from 'react-native';

import { Colors } from '../components/theme';

export const HomeStyles = StyleSheet.create({
    backButton: {
        marginTop: 20
    },
    bottomContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    bottomLink: {
        color: Colors.black
    },
    buttonWrapper: {
        gap: 10
    },
    centerContainer: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        justifyContent: 'space-between'
    }
});
