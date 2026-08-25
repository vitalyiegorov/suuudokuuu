import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const NewspaperLightTheme: ThemeInterface = {
    hasErrorOutline: false,
    colors: {
        background: '#f5f5f5',
        ink: '#1a1a1a',
        inkText: '#ffffff',
        overlayLight: 'rgba(26, 26, 26, 0.25)',
        overlayDark: 'rgba(255, 255, 255, 0.5)',
        danger: '#990000',
        dangerText: '#FFFFFF',
        accent: '#000080',
        text: {
            primary: '#1a1a1a',
            hint: 'rgba(26, 26, 26, 0.68)'
        },
        board: {
            selected: '#cccccc',
            selectedText: '#1a1a1a',
            sameValue: '#cfcfcf',
            sameValueText: '#1a1a1a',
            error: '#EBB0AB',
            filled: '#f5f5f5',
            emptyText: 'rgba(26, 26, 26, 0.5)'
        },
        candidate: {
            text: 'rgba(26, 26, 26, 0.7)',
            textSelected: '#ffffff',
            fill: '#ffffff',
            fillSelected: '#4d4d4d',
            borderSelected: '#1a1a1a'
        },
        numpad: {
            track: '#cccccc',
            trackFilled: '#4d4d4d',
            trackFilledText: '#ffffff',
            text: '#1a1a1a'
        },
        surface: {
            raised: '#ffffff',
            raisedText: '#1a1a1a',
            subtle: '#eaeaea',
            subtleText: '#1a1a1a',
            subtleHint: 'rgba(26, 26, 26, 0.65)',
            border: 'rgba(26, 26, 26, 0.1)'
        }
    }
};

export const NewspaperDarkTheme: ThemeInterface = {
    hasErrorOutline: false,
    colors: {
        background: '#1a1a1a',
        ink: '#f0f0f0',
        inkText: '#000000',
        overlayLight: 'rgba(240, 240, 240, 0.25)',
        overlayDark: 'rgba(0, 0, 0, 0.5)',
        danger: '#ff4d4d',
        dangerText: '#1a1a1a',
        accent: '#5c5cff',
        text: {
            primary: '#f0f0f0',
            hint: 'rgba(240, 240, 240, 0.5)'
        },
        board: {
            selected: '#4d4d4d',
            selectedText: '#f0f0f0',
            sameValue: '#444444',
            sameValueText: '#f0f0f0',
            error: '#8C2622',
            filled: '#1a1a1a',
            emptyText: 'rgba(240, 240, 240, 0.5)'
        },
        candidate: {
            text: 'rgba(240, 240, 240, 0.7)',
            textSelected: '#1a1a1a',
            fill: '#1a1a1a',
            fillSelected: '#cccccc',
            borderSelected: '#ffffff'
        },
        numpad: {
            track: '#5c5c5c',
            trackFilled: '#cccccc',
            trackFilledText: '#000000',
            text: '#f0f0f0'
        },
        surface: {
            raised: '#000000',
            raisedText: '#f0f0f0',
            subtle: '#2a2a2a',
            subtleText: '#f0f0f0',
            subtleHint: 'rgba(240, 240, 240, 0.65)',
            border: 'rgba(240, 240, 240, 0.28)'
        }
    }
};
