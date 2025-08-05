import type { ThemeInterface } from '../interface/theme.interface';

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
            candidate: 'rgba(0, 0, 0, 0.5)',
            candidateActive: 'rgba(0, 0, 0, 1)',
            candidateActiveBg: 'rgba(0, 255, 0, 0.5)',
            filled: 'rgba(0, 0, 0, 0.01)'
        },
        value: {
            border: 'rgba(0,0,0,0.15)',
            progress: 'rgba(0, 255, 0, 0.3)',
            progressActive: 'rgba(0, 255, 0, 1)',
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
        blue: 'rgba(0,0,255,0.28)',
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
            candidate: 'rgba(255, 255, 255, 0.5)',
            candidateActive: 'rgba(255, 255, 255, 1)',
            candidateActiveBg: 'rgba(0, 255, 0, 0.5)',
            filled: 'rgba(255, 255, 255, 0.2)'
        },
        value: {
            border: 'rgba(255,255,255,0.15)',
            progress: 'rgba(0, 255, 0, 0.3)',
            progressActive: 'rgba(0, 255, 0, 0.7)',
            text: 'rgba(255, 255, 255,1)'
        }
    }
};
