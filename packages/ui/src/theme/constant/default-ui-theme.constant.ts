import type { ThemeInterface } from '../interface/theme.interface';

export const DefaultUiTheme: ThemeInterface = {
    colors: {
        background: '#ffffff',
        black: '#000000',
        black05: 'rgba(0, 0, 0, 0.05)',
        blue: '#0057b8',
        candidate: {
            bg: '#ffffff',
            bgActive: '#000000',
            border: '#d8d8d8',
            borderActive: '#000000',
            text: '#000000',
            textActive: '#ffffff'
        },
        cell: {
            active: '#000000',
            activeText: '#ffffff',
            activeValue: '#000000',
            activeValueText: '#ffffff',
            emptyValueText: '#000000',
            error: '#ff2d2d',
            filled: '#d9d9d9',
            highlighted: '#f2f2f2',
            highlightedText: '#000000'
        },
        label: {
            hint: '#8f8f8f',
            inverted: '#ffffff',
            main: '#000000'
        },
        red: '#D40000',
        redFillText: '#ffffff',
        surface: {
            raised: '#ffffff',
            raisedText: '#000000',
            subtle: '#f2f2f2',
            subtleHint: 'rgba(0, 0, 0, 0.65)',
            subtleText: '#000000'
        },
        value: {
            border: '#d8d8d8',
            progress: '#e5e5e5',
            progressActive: '#7a7a7a',
            text: '#000000'
        },
        white: '#ffffff',
        white05: 'rgba(255, 255, 255, 0.05)'
    }
};
