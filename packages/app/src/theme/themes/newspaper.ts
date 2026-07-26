import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const NewspaperLightTheme: ThemeInterface = {
    colors: {
        label: {
            main: '#1a1a1a',
            inverted: '#ffffff',
            hint: 'rgba(26, 26, 26, 0.5)'
        },
        background: '#f5f5f5',
        white: '#ffffff',
        white05: 'rgba(255, 255, 255, 0.5)',
        black: '#1a1a1a',
        black05: 'rgba(26, 26, 26, 0.25)',
        red: '#990000',
        redFillText: '#FFFFFF',
        blue: '#000080',
        cell: {
            active: '#cccccc',
            activeText: '#1a1a1a',
            highlighted: '#eaeaea',
            highlightedText: '#1a1a1a',
            activeValue: '#cfcfcf',
            activeValueText: '#1a1a1a',
            error: '#990000',
            emptyValueText: 'rgba(26, 26, 26, 0.5)',
            filled: '#f5f5f5'
        },
        value: {
            border: 'rgba(26, 26, 26, 0.1)',
            progress: '#cccccc',
            progressActive: '#4d4d4d',
            progressActiveText: '#ffffff',
            text: '#1a1a1a'
        },
        candidate: {
            text: 'rgba(26, 26, 26, 0.7)',
            textActive: '#ffffff',
            bgActive: '#4d4d4d',
            bg: '#ffffff',
            border: 'rgba(26, 26, 26, 0.2)',
            borderActive: '#1a1a1a'
        },
        surface: {
            raised: '#ffffff',
            raisedText: '#1a1a1a',
            subtle: '#eaeaea',
            subtleHint: 'rgba(26, 26, 26, 0.65)',
            subtleText: '#1a1a1a'
        }
    }
};

export const NewspaperDarkTheme: ThemeInterface = {
    colors: {
        label: {
            main: '#f0f0f0',
            inverted: '#000000',
            hint: 'rgba(240, 240, 240, 0.5)'
        },
        background: '#1a1a1a',
        white: '#000000',
        white05: 'rgba(0, 0, 0, 0.5)',
        black: '#f0f0f0',
        black05: 'rgba(240, 240, 240, 0.25)',
        red: '#ff4d4d',
        redFillText: '#1a1a1a',
        blue: '#5c5cff',
        cell: {
            active: '#4d4d4d',
            activeText: '#f0f0f0',
            highlighted: '#2a2a2a',
            highlightedText: '#f0f0f0',
            activeValue: '#444444',
            activeValueText: '#f0f0f0',
            error: '#ff4d4d',
            emptyValueText: 'rgba(240, 240, 240, 0.5)',
            filled: '#1a1a1a'
        },
        value: {
            border: 'rgba(240, 240, 240, 0.28)',
            progress: '#888888',
            progressActive: '#cccccc',
            progressActiveText: '#000000',
            text: '#f0f0f0'
        },
        candidate: {
            text: 'rgba(240, 240, 240, 0.7)',
            textActive: '#1a1a1a',
            bgActive: '#cccccc',
            bg: '#1a1a1a',
            border: 'rgba(240, 240, 240, 0.32)',
            borderActive: '#ffffff'
        },
        surface: {
            raised: '#000000',
            raisedText: '#f0f0f0',
            subtle: '#2a2a2a',
            subtleHint: 'rgba(240, 240, 240, 0.65)',
            subtleText: '#f0f0f0'
        }
    }
};
