import type { ThemeInterface } from '@suuudokuuu/ui/theme';

export const BWLightTheme: ThemeInterface = {
    hasErrorOutline: false,
    colors: {
        background: '#f2f2f2',
        ink: 'rgb(0, 0, 0)',
        inkText: 'rgba(255, 255, 255, 1)',
        overlayLight: 'rgba(0, 0, 0, 0.25)',
        overlayDark: 'rgba(255, 255, 255, 0.5)',
        danger: 'rgba(212, 0, 0, 1)',
        dangerText: 'rgba(255, 255, 255, 1)',
        accent: 'rgba(0,0,255,0.28)',
        text: {
            primary: 'rgba(0, 0, 0, 1)',
            hint: 'rgba(0, 0, 0, 0.62)'
        },
        board: {
            selected: 'rgba(0, 255, 0, 1)',
            selectedText: 'rgba(0, 0, 0, 1)',
            sameValue: 'rgba(0, 255, 0, 0.5)',
            sameValueText: 'rgba(0, 0, 0, 1)',
            error: 'rgba(255, 0, 0, 1)',
            filled: 'rgba(0, 0, 0, 0.01)',
            emptyText: 'rgba(0, 0, 0, 0.5)'
        },
        candidate: {
            text: 'rgba(0, 0, 0, 0.62)',
            textSelected: 'rgba(0, 0, 0, 1)',
            fill: 'rgb(255, 255, 255)',
            fillSelected: 'rgba(0, 255, 0, 0.5)',
            borderSelected: 'rgba(0, 255, 0, 1)'
        },
        numpad: {
            track: 'rgba(0, 0, 0, 0.12)',
            trackFilled: 'rgba(0, 0, 0, 0.72)',
            trackFilledText: 'rgb(255, 255, 255)',
            text: 'rgba(0, 0, 0,1)'
        },
        surface: {
            raised: 'rgb(255, 255, 255)',
            raisedText: 'rgba(0, 0, 0, 1)',
            subtle: 'rgba(0,0,0,0.1)',
            subtleText: 'rgba(0, 0, 0, 1)',
            subtleHint: 'rgba(0, 0, 0, 0.65)',
            border: 'rgba(0,0,0,0.15)'
        }
    }
};

export const BWDarkTheme: ThemeInterface = {
    hasErrorOutline: false,
    colors: {
        background: '#010101',
        ink: 'rgb(255, 255, 255)',
        inkText: 'rgba(0, 0, 0, 1)',
        overlayLight: 'rgba(255, 255, 255, 0.25)',
        overlayDark: 'rgba(0, 0, 0, 0.5)',
        danger: 'rgba(237, 0, 0, 1)',
        dangerText: 'rgba(255, 255, 255, 1)',
        accent: 'rgba(128, 138, 255, 0.9)',
        text: {
            primary: 'rgba(255, 255, 255, 1)',
            hint: 'rgba(255, 255, 255, 0.5)'
        },
        board: {
            selected: 'rgba(0, 255, 0, 0.7)',
            selectedText: 'rgba(0, 0, 0, 1)',
            sameValue: 'rgba(0, 255, 0, 0.5)',
            sameValueText: 'rgba(255, 255, 255, 1)',
            error: 'rgba(212, 0, 0, 1)',
            filled: 'rgba(255, 255, 255, 0.2)',
            emptyText: 'rgba(255, 255, 255, 0.1)'
        },
        candidate: {
            text: 'rgba(255, 255, 255, 0.5)',
            textSelected: 'rgba(255, 255, 255, 1)',
            fill: 'rgb(0, 0, 0)',
            fillSelected: 'rgba(0, 255, 0, 0.5)',
            borderSelected: 'rgba(0, 255, 0, 0.7)'
        },
        numpad: {
            track: 'rgba(255, 255, 255, 0.14)',
            trackFilled: 'rgba(255, 255, 255, 0.72)',
            trackFilledText: 'rgb(0, 0, 0)',
            text: 'rgba(255, 255, 255,1)'
        },
        surface: {
            raised: 'rgb(0, 0, 0)',
            raisedText: 'rgba(255, 255, 255, 1)',
            subtle: 'rgba(255,255,255,0.35)',
            subtleText: 'rgba(255, 255, 255, 1)',
            subtleHint: 'rgba(255, 255, 255, 0.75)',
            border: 'rgba(255,255,255,0.3)'
        }
    }
};
