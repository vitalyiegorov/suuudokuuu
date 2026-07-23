import type { ThemeInterface } from '@suuudokuuu/ui';

export const BWLightTheme: ThemeInterface = {
    colors: {
        label: {
            main: 'rgba(0, 0, 0, 1)',
            inverted: 'rgba(255, 255, 255, 1)',
            hint: 'rgba(0, 0, 0, 0.5)'
        },
        background: '#f2f2f2',
        white: 'rgb(255, 255, 255)',
        white05: 'rgba(255, 255, 255, 0.5)',
        black: 'rgb(0, 0, 0)',
        black05: 'rgba(0, 0, 0, 0.25)',
        red: 'rgba(255, 0, 0, 1)',
        blue: 'rgba(0,0,255,0.28)',
        cell: {
            active: 'rgba(0, 255, 0, 1)',
            activeText: 'rgba(0, 0, 0, 1)',
            highlighted: 'rgba(0,0,0,0.1)',
            highlightedText: 'rgba(0, 0, 0, 1)',
            activeValue: 'rgba(0, 255, 0, 0.5)',
            activeValueText: 'rgba(0, 0, 0, 1)',
            error: 'rgba(255, 0, 0, 1)',
            emptyValueText: 'rgba(0, 0, 0, 0.5)',
            filled: 'rgba(0, 0, 0, 0.01)'
        },
        candidate: {
            text: 'rgba(0, 0, 0, 0.5)',
            textActive: 'rgba(0, 0, 0, 1)',
            bgActive: 'rgba(0, 255, 0, 0.5)',
            bg: 'rgb(255, 255, 255)',
            border: 'rgba(0,0,0,0.15)',
            borderActive: 'rgba(0, 255, 0, 1)'
        },
        value: {
            border: 'rgba(0,0,0,0.15)',
            progress: 'rgba(0, 0, 0, 0.12)',
            progressActive: 'rgba(0, 0, 0, 0.72)',
            text: 'rgba(0, 0, 0,1)'
        }
    }
};

export const BWDarkTheme: ThemeInterface = {
    colors: {
        background: '#010101',
        white: 'rgb(0, 0, 0)',
        white05: 'rgba(0, 0, 0, 0.5)',
        black: 'rgb(255, 255, 255)',
        black05: 'rgba(255, 255, 255, 0.25)',
        red: 'rgba(255, 0, 0, 1)',
        blue: 'rgba(128, 138, 255, 0.9)',
        label: {
            main: 'rgba(255, 255, 255, 1)',
            inverted: 'rgba(0, 0, 0, 1)',
            hint: 'rgba(255, 255, 255, 0.5)'
        },
        cell: {
            active: 'rgba(0, 255, 0, 0.7)',
            activeText: 'rgba(255, 255, 255, 1)',
            highlighted: 'rgba(255,255,255,0.35)',
            highlightedText: 'rgba(255, 255, 255, 1)',
            activeValue: 'rgba(0, 255, 0, 0.5)',
            activeValueText: 'rgba(255, 255, 255, 1)',
            emptyValueText: 'rgba(255, 255, 255, 0.1)',
            error: 'rgba(255, 0, 0, 1)',
            filled: 'rgba(255, 255, 255, 0.2)'
        },
        candidate: {
            text: 'rgba(255, 255, 255, 0.5)',
            textActive: 'rgba(255, 255, 255, 1)',
            bgActive: 'rgba(0, 255, 0, 0.5)',
            bg: 'rgb(0, 0, 0)',
            border: 'rgba(255,255,255,0.15)',
            borderActive: 'rgba(0, 255, 0, 0.7)'
        },
        value: {
            border: 'rgba(255,255,255,0.15)',
            progress: 'rgba(255, 255, 255, 0.14)',
            progressActive: 'rgba(255, 255, 255, 0.72)',
            text: 'rgba(255, 255, 255,1)'
        }
    }
};
