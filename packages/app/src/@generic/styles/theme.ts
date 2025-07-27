import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const WhiteTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#f2f2f2',
        white: 'rgb(255, 255, 255)',
        black: 'rgb(0, 0, 0)',
        red: 'rgba(255, 0, 0, 1)',
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

export const BlackTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: '#010101',
        white: 'rgb(0, 0, 0)',
        black: 'rgb(255, 255, 255)',
        red: 'rgba(255, 0, 0, 1)',
        cell: {
            active: 'rgba(0, 255, 0, 0.7)',
            activeText: 'rgba(255, 255, 255, 1)',
            highlighted: 'rgba(255,255,255,0.35)',
            highlightedText: 'rgba(255, 255, 255, 1)',
            activeValue: 'rgba(255, 255, 255, 0.4)',
            activeValueText: 'rgba(255, 255, 255, 1)',
            emptyValueText: 'rgba(255, 255, 255, 0.1)',
            error: 'rgba(255, 0, 0, 1)',
            candidate: 'rgba(255, 255, 255, 0.5)',
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
