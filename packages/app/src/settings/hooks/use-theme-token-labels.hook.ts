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
        white: t`Base light color`,
        white05: t`Base light color (translucent)`,
        black: t`Base dark color`,
        black05: t`Base dark color (translucent)`,
        red: t`Error accent`,
        redFillText: t`Text on error accent`,
        blue: t`Info accent`,
        'label.main': t`Primary text`,
        'label.inverted': t`Inverted text`,
        'label.hint': t`Hint text`,
        'cell.active': t`Active cell`,
        'cell.activeText': t`Active cell text`,
        'cell.highlighted': t`Highlighted cell`,
        'cell.highlightedText': t`Highlighted cell text`,
        'cell.activeValue': t`Matching value cell`,
        'cell.activeValueText': t`Matching value text`,
        'cell.error': t`Error cell`,
        'cell.emptyValueText': t`Empty cell text`,
        'cell.filled': t`Filled cell`,
        'candidate.border': t`Candidate border`,
        'candidate.borderActive': t`Active candidate border`,
        'candidate.text': t`Candidate text`,
        'candidate.textActive': t`Active candidate text`,
        'candidate.bg': t`Candidate background`,
        'candidate.bgActive': t`Active candidate background`,
        'value.border': t`Numpad border`,
        'value.progress': t`Numpad progress`,
        'value.progressActive': t`Numpad progress (active)`,
        'value.progressActiveText': t`Numpad progress text`,
        'value.text': t`Numpad text`,
        'surface.raised': t`Raised surface`,
        'surface.raisedText': t`Raised surface text`,
        'surface.subtle': t`Subtle surface`,
        'surface.subtleText': t`Subtle surface text`,
        'surface.subtleHint': t`Subtle surface hint`
    };

    const getSectionTitle = (sectionKey: string) => sectionTitles[sectionKey] ?? sectionKey;
    const getTokenLabel = (tokenKey: string) => tokenLabels[tokenKey] ?? tokenKey;

    return { getSectionTitle, getTokenLabel };
};
