const sheetContentWidthStyleId = 'suuudokuuu-sheet-content-width';

const sheetContentWidthCss = `[data-vaul-drawer] {
    max-width: 640px;
    margin-left: auto;
    margin-right: auto;
}`;

export const applySheetContentWidth = (): void => {
    if (typeof document === 'undefined' || document.getElementById(sheetContentWidthStyleId) !== null) {
        return;
    }

    const styleElement = document.createElement('style');

    styleElement.id = sheetContentWidthStyleId;
    styleElement.textContent = sheetContentWidthCss;
    document.head.append(styleElement);
};
