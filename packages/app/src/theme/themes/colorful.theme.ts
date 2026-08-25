import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const ColorfulLightTheme: ThemeInterface = {
    hasErrorOutline: false,
    colors: {
        background: '#F7ECD0',
        ink: '#000000',
        inkText: '#F6DA99',
        overlayLight: 'rgba(0, 0, 0, 0.25)',
        overlayDark: 'rgba(255, 255, 255, 0.5)',
        danger: '#B23D38',
        dangerText: '#FFFFFF',
        accent: '#8FA8C1',
        text: {
            primary: '#2A3B4D',
            hint: '#3D5130'
        },
        board: {
            selected: '#AFCEBE',
            selectedText: '#2A3B4D',
            sameValue: '#D9E3D8',
            sameValueText: '#2A3B4D',
            error: '#FBDE66',
            filled: '#E1DACA',
            emptyText: 'rgba(74, 97, 58, 0.75)'
        },
        candidate: {
            text: '#3D5130',
            textSelected: '#2A3B4D',
            fill: '#FFFFFF',
            fillSelected: '#D9E3D8',
            borderSelected: '#AFCEBE'
        },
        numpad: {
            track: '#F6DA99',
            trackFilled: '#FFFD74',
            trackFilledText: '#2A3B4D',
            text: '#2A3B4D'
        },
        surface: {
            raised: '#FFFFFF',
            raisedText: '#2A3B4D',
            subtle: '#D0C7B8',
            subtleText: '#2A3B4D',
            subtleHint: 'rgba(42, 59, 77, 0.85)',
            border: 'rgba(193, 182, 164, 0.5)'
        }
    }
};

export const ColorfulDarkTheme: ThemeInterface = {
    hasErrorOutline: false,
    colors: {
        background: '#2A3B4D',
        ink: '#000000',
        inkText: '#7fafef',
        overlayLight: 'rgba(255, 255, 255, 0.25)',
        overlayDark: 'rgba(0, 0, 0, 0.5)',
        danger: '#FF8566',
        dangerText: '#2A3B4D',
        accent: '#445B7A',
        text: {
            primary: '#F6DA99',
            hint: 'rgba(205, 208, 194, 0.75)'
        },
        board: {
            selected: '#4B613A',
            selectedText: '#EDECE7',
            sameValue: '#829B74',
            sameValueText: '#1B1B1A',
            error: '#CD6058',
            filled: '#D0C7B8',
            emptyText: 'rgba(205, 208, 194, 0.75)'
        },
        candidate: {
            text: 'rgba(205, 208, 194, 0.75)',
            textSelected: '#1B1B1A',
            fill: '#2A3B4D',
            fillSelected: '#829B74',
            borderSelected: '#4B613A'
        },
        numpad: {
            track: '#F0AE1C',
            trackFilled: '#A9A931',
            trackFilledText: '#1b1b1a',
            text: '#1b1b1a'
        },
        surface: {
            raised: '#FFFFFF',
            raisedText: '#2A3B4D',
            subtle: '#8FA8C1',
            subtleText: '#2A3B4D',
            subtleHint: '#2A3B4D',
            border: 'rgba(143, 168, 193, 0.55)'
        }
    }
};
