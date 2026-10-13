export interface ThemeInterface {
    readonly hasErrorOutline: boolean;
    readonly colors: {
        readonly background: string;
        readonly ink: string;
        readonly inkText: string;
        readonly overlayLight: string;
        readonly overlayDark: string;
        readonly danger: string;
        readonly dangerText: string;
        readonly accent: string;
        readonly text: {
            readonly primary: string;
            readonly hint: string;
        };
        readonly board: {
            readonly selected: string;
            readonly selectedText: string;
            readonly sameValue: string;
            readonly sameValueText: string;
            readonly error: string;
            readonly filled: string;
            readonly emptyText: string;
        };
        readonly candidate: {
            readonly text: string;
            readonly textSelected: string;
            readonly fill: string;
            readonly fillSelected: string;
            readonly borderSelected: string;
        };
        readonly numpad: {
            readonly track: string;
            readonly trackFilled: string;
            readonly trackFilledText: string;
            readonly text: string;
        };
        readonly surface: {
            readonly raised: string;
            readonly raisedText: string;
            readonly subtle: string;
            readonly subtleText: string;
            readonly subtleHint: string;
            readonly group: string;
            readonly border: string;
        };
    };
}
