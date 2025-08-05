import type { ThemeInterface } from '../interface/theme.interface';

export const ColorfulLightTheme: ThemeInterface = {
    colors: {
        background: '#F7ECD0',
        white: '#FFFFFF',
        white05: 'rgba(255, 255, 255, 0.5)',
        black: '#000000',
        black05: 'rgba(0, 0, 0, 0.25)',
        red: '#C24641',
        blue: '#8FA8C1',
        label: {
            main: '#2A3B4D',
            inverted: '#F6DA99',
            hint: 'rgba(74, 97, 58, 0.75)'
        },
        cell: {
            active: '#AFCEBE',
            activeText: '#2A3B4D',
            highlighted: '#D0C7B8',
            highlightedText: '#2A3B4D',
            activeValue: '#D9E3D8',
            activeValueText: '#2A3B4D',
            error: '#FBDE66',
            emptyValueText: 'rgba(74, 97, 58, 0.75)',
            filled: '#E1DACA'
        },
        candidate: {
            text: 'rgba(74, 97, 58, 0.75)',
            textActive: '#AFCEBE',
            bgActive: '#D9E3D8'
        },
        value: {
            border: 'rgba(193, 182, 164, 0.5)',
            progress: '#F6DA99',
            progressActive: '#FFFD74',
            text: '#2A3B4D'
        }
    }
};

export const ColorfulDarkTheme: ThemeInterface = {
    colors: {
        background: '#2A3B4D',
        white: '#FFFFFF',
        white05: 'rgba(255, 255, 255, 0.5)',
        black: '#000000',
        black05: 'rgba(0, 0, 0, 0.25)',
        red: '#91111E',
        blue: '#445B7A',
        label: {
            inverted: '#7fafef',
            main: '#F6DA99',
            hint: 'rgba(205, 208, 194, 0.75)'
        },
        cell: {
            active: '#4B613A',
            activeText: '#EDECE7',
            highlighted: '#8FA8C1',
            highlightedText: '#EDECE7',
            activeValue: '#829B74',
            activeValueText: '#EDECE7',
            error: '#C24641',
            emptyValueText: 'rgba(205, 208, 194, 0.75)',
            filled: '#D0C7B8'
        },
        candidate: {
            text: 'rgba(205, 208, 194, 0.75)',
            textActive: '#4B613A',
            bgActive: '#829B74'
        },
        value: {
            border: 'rgba(68, 91, 122, 0.5)',
            progress: '#F0AE1C',
            progressActive: '#A9A931',
            text: '#1b1b1a'
        }
    }
};
