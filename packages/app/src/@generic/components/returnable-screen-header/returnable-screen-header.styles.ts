import { StyleSheet } from 'react-native-unistyles';

import {
    ReturnableScreenHeaderLargeTitleVerticalOffset,
    ReturnableScreenHeaderSmallTitleVerticalOffset,
    ReturnableScreenHeaderTitleSlotVerticalOffset
} from './constant/returnable-screen-header.constant';

export const ReturnableScreenHeaderStyles = StyleSheet.create(theme => ({
    container: {
        width: '100%'
    },
    row: {
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        height: 56,
        maxWidth: theme.contentWidth.standard,
        paddingHorizontal: 16,
        width: '100%',
        zIndex: 3
    },
    largeTitle: {
        fontSize: 31,
        marginBottom: 0
    },
    largeTitleLayer: {
        alignItems: 'flex-start',
        transform: [{ translateY: ReturnableScreenHeaderLargeTitleVerticalOffset }]
    },
    smallTitle: {
        fontSize: 17,
        marginBottom: 0
    },
    smallTitleLayer: {
        transform: [{ translateY: ReturnableScreenHeaderSmallTitleVerticalOffset }]
    },
    titleLayer: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 3
    },
    titleSlot: {
        flex: 1,
        height: 56,
        position: 'relative',
        transform: [{ translateY: ReturnableScreenHeaderTitleSlotVerticalOffset }]
    },
    trailingSpace: {
        height: 44,
        width: 44
    }
}));
