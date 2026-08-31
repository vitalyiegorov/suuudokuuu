export interface ThemeInterface {
    hasErrorOutline: boolean;
    colors: {
        background: string;
        ink: string;
        inkText: string;
        overlayLight: string;
        overlayDark: string;
        danger: string;
        dangerText: string;
        accent: string;
        text: {
            primary: string;
            hint: string;
        };
        board: {
            selected: string;
            selectedText: string;
            sameValue: string;
            sameValueText: string;
            error: string;
            filled: string;
            emptyText: string;
        };
        candidate: {
            text: string;
            textSelected: string;
            fill: string;
            fillSelected: string;
            borderSelected: string;
        };
        numpad: {
            track: string;
            trackFilled: string;
            trackFilledText: string;
            text: string;
        };
        surface: {
            raised: string;
            raisedText: string;
            subtle: string;
            subtleText: string;
            subtleHint: string;
            border: string;
        };
    };
}
