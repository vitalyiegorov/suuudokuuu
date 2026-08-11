import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const ColorblindSafeLightTheme: ThemeInterface = {
    hasErrorOutline: true,
    colors: {
        background: '#ffffff',
        ink: '#111111',
        inkText: '#ffffff',
        overlayLight: 'rgba(17, 17, 17, 0.35)',
        overlayDark: 'rgba(255, 255, 255, 0.6)',
        danger: '#8c3b00',
        dangerText: '#ffffff',
        accent: '#0072b2',
        text: {
            primary: '#111111',
            hint: '#4a4a4a'
        },
        board: {
            selected: '#0b4f9c',
            selectedText: '#ffffff',
            sameValue: '#bbd9f2',
            sameValueText: '#0b2440',
            error: '#e8a860',
            filled: '#ededed',
            emptyText: '#6b6b6b'
        },
        candidate: {
            text: '#3a3a3a',
            textSelected: '#0b2440',
            fill: '#ffffff',
            fillSelected: '#bbd9f2',
            borderSelected: '#0072b2'
        },
        numpad: {
            track: '#d6e6f5',
            trackFilled: '#0072b2',
            trackFilledText: '#ffffff',
            text: '#0b2440'
        },
        surface: {
            raised: '#ffffff',
            raisedText: '#111111',
            subtle: '#e4e4e4',
            subtleText: '#111111',
            subtleHint: '#3a3a3a',
            border: '#5a5a5a'
        }
    }
};

export const ColorblindSafeDarkTheme: ThemeInterface = {
    hasErrorOutline: true,
    colors: {
        background: '#000000',
        ink: '#f2f2f2',
        inkText: '#001428',
        overlayLight: 'rgba(242, 242, 242, 0.35)',
        overlayDark: 'rgba(0, 0, 0, 0.6)',
        danger: '#e69f00',
        dangerText: '#001428',
        accent: '#56b4e9',
        text: {
            primary: '#f2f2f2',
            hint: '#bdbdbd'
        },
        board: {
            selected: '#8cc5f0',
            selectedText: '#001428',
            sameValue: '#0e3a63',
            sameValueText: '#eaf3fb',
            error: '#8a4d00',
            filled: '#1f1f1f',
            emptyText: '#8a8a8a'
        },
        candidate: {
            text: '#bdbdbd',
            textSelected: '#eaf3fb',
            fill: '#0a0a0a',
            fillSelected: '#0e3a63',
            borderSelected: '#56b4e9'
        },
        numpad: {
            track: '#1d3a52',
            trackFilled: '#56b4e9',
            trackFilledText: '#001428',
            text: '#eaf3fb'
        },
        surface: {
            raised: '#0a0a0a',
            raisedText: '#f2f2f2',
            subtle: '#26303a',
            subtleText: '#f2f2f2',
            subtleHint: '#bdbdbd',
            border: '#6b7a87'
        }
    }
};
