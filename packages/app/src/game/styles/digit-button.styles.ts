import { StyleSheet } from 'react-native-unistyles';

import { PanelControlPillRadiusConstant } from '../constant/panel-control-size.constant';

export const DigitButtonStyles = StyleSheet.create(theme => ({
    button: {
        alignItems: 'center',
        borderRadius: PanelControlPillRadiusConstant,
        height: '100%',
        justifyContent: 'center',
        outlineOffset: 0,
        outlineWidth: 0,
        overflow: 'visible',
        position: 'relative',
        width: '100%',
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            },
            '_focus-visible': {
                outlineColor: theme.colors.ink,
                outlineOffset: 2,
                outlineStyle: 'solid',
                outlineWidth: 2
            }
        }
    },
    container: {
        position: 'relative'
    },
    exhausted: {
        opacity: 0.35
    }
}));
