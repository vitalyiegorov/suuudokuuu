import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Appearance } from 'react-native';

export const WhiteTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        white: 'rgb(255, 255, 255)',
        black: 'rgb(0, 0, 0)',
        cell: {
            active: 'rgba(0, 255, 0, 1)',
            highlighted: 'rgba(0,0,0,0.05)',
            highlightedText: 'rgba(0, 255, 0, 1)',
            activeValueText: 'rgba(201, 242, 155, 0.5)'
        }
    }
};

export const BlackTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        white: 'rgb(0, 0, 0)',
        black: 'rgb(255, 255, 255)',
        cell: {
            active: 'rgba(0, 255, 0, 1)',
            highlighted: 'rgba(255,255,255,0.05)',
            highlightedText: 'rgba(0, 255, 0, 1)',
            activeValueText: 'rgba(201, 242, 155, 0.5)'
        }
    }
};

export const Colors = Appearance.getColorScheme() === 'dark' ? BlackTheme.colors : WhiteTheme.colors;
