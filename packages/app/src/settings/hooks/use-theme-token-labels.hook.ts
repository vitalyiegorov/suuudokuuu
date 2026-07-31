import { useLingui } from '@lingui/react/macro';

export const useThemeTokenLabels = () => {
    const { t } = useLingui();

    const sectionTitles: Record<string, string> = {
        general: t`General`,
        labels: t`Text and labels`,
        cells: t`Board cells`,
        candidates: t`Candidates`,
        numpad: t`Number pad`,
        surfaces: t`Surfaces`
    };

    const tokenLabels: Record<string, string> = {
        background: t`Screen background`,
        ink: t`Ink`,
        inkText: t`Text on ink`,
        overlayLight: t`Light overlay`,
        overlayDark: t`Dark overlay`,
        danger: t`Danger accent`,
        dangerText: t`Text on danger accent`,
        accent: t`Accent`,
        'text.primary': t`Primary text`,
        'text.hint': t`Hint text`,
        'board.selected': t`Selected cell`,
        'board.selectedText': t`Selected cell text`,
        'board.sameValue': t`Same-value cell`,
        'board.sameValueText': t`Same-value cell text`,
        'board.error': t`Error cell`,
        'board.filled': t`Filled cell`,
        'board.emptyText': t`Empty cell text`,
        'candidate.text': t`Candidate text`,
        'candidate.textSelected': t`Selected candidate text`,
        'candidate.fill': t`Candidate background`,
        'candidate.fillSelected': t`Selected candidate background`,
        'candidate.borderSelected': t`Selected candidate border`,
        'numpad.track': t`Numpad track`,
        'numpad.trackFilled': t`Numpad track (filled)`,
        'numpad.trackFilledText': t`Text on filled numpad track`,
        'numpad.text': t`Numpad text`,
        'surface.raised': t`Raised surface`,
        'surface.raisedText': t`Raised surface text`,
        'surface.subtle': t`Subtle surface`,
        'surface.subtleText': t`Subtle surface text`,
        'surface.subtleHint': t`Subtle surface hint`,
        'surface.border': t`Surface border`
    };

    const getSectionTitle = (sectionKey: string) => sectionTitles[sectionKey] ?? sectionKey;
    const getTokenLabel = (tokenKey: string) => tokenLabels[tokenKey] ?? tokenKey;

    return { getSectionTitle, getTokenLabel };
};
