import type { ThemeInterface } from '../interface/theme.interface';

export const DefaultUiTheme: ThemeInterface = {
    colors: {
        background: '#ffffff',
        ink: '#000000',
        inkText: '#ffffff',
        overlayLight: 'rgba(0, 0, 0, 0.05)',
        overlayDark: 'rgba(255, 255, 255, 0.05)',
        danger: '#D40000',
        dangerText: '#ffffff',
        accent: '#0057b8',
        text: {
            primary: '#000000',
            hint: '#8f8f8f'
        },
        board: {
            selected: '#000000',
            selectedText: '#ffffff',
            sameValue: '#000000',
            sameValueText: '#ffffff',
            error: '#ff2d2d',
            filled: '#d9d9d9',
            emptyText: '#000000'
        },
        candidate: {
            text: '#000000',
            textSelected: '#ffffff',
            fill: '#ffffff',
            fillSelected: '#000000',
            borderSelected: '#000000'
        },
        numpad: {
            track: '#e5e5e5',
            trackFilled: '#7a7a7a',
            trackFilledText: '#ffffff',
            text: '#000000'
        },
        surface: {
            raised: '#ffffff',
            raisedText: '#000000',
            subtle: '#f2f2f2',
            subtleText: '#000000',
            subtleHint: 'rgba(0, 0, 0, 0.65)',
            border: '#d8d8d8'
        }
    }
};
