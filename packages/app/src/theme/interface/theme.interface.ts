export interface ThemeInterface {
    colors: {
        background: string;
        white: string;
        white05: string;
        black: string;
        black05: string;
        red: string;
        blue: string;
        label: {
            main: string;
            inverted: string;
            hint: string;
        };
        candidate: {
            border: string;
            borderActive: string;
            text: string;
            textActive: string;
            bg: string;
            bgActive: string;
        };
        cell: {
            active: string;
            activeText: string;
            highlighted: string;
            highlightedText: string;
            activeValue: string;
            activeValueText: string;
            error: string;
            emptyValueText: string;
            filled: string;
        };
        value: {
            border: string;
            progress: string;
            progressActive: string;
            text: string;
        };
    };
}
