import type { ThemeEditorSectionInterface } from '../interface/theme-editor-token.interface';

export const ThemeEditorSections: readonly ThemeEditorSectionInterface[] = [
    {
        key: 'general',
        tokens: [
            { key: 'background', getValue: colors => colors.background, setValue: (colors, value) => ({ ...colors, background: value }) },
            { key: 'white', getValue: colors => colors.white, setValue: (colors, value) => ({ ...colors, white: value }) },
            { key: 'white05', getValue: colors => colors.white05, setValue: (colors, value) => ({ ...colors, white05: value }) },
            { key: 'black', getValue: colors => colors.black, setValue: (colors, value) => ({ ...colors, black: value }) },
            { key: 'black05', getValue: colors => colors.black05, setValue: (colors, value) => ({ ...colors, black05: value }) },
            { key: 'red', getValue: colors => colors.red, setValue: (colors, value) => ({ ...colors, red: value }) },
            {
                key: 'redFillText',
                getValue: colors => colors.redFillText,
                setValue: (colors, value) => ({ ...colors, redFillText: value })
            },
            { key: 'blue', getValue: colors => colors.blue, setValue: (colors, value) => ({ ...colors, blue: value }) }
        ]
    },
    {
        key: 'labels',
        tokens: [
            {
                key: 'label.main',
                getValue: colors => colors.label.main,
                setValue: (colors, value) => ({ ...colors, label: { ...colors.label, main: value } })
            },
            {
                key: 'label.inverted',
                getValue: colors => colors.label.inverted,
                setValue: (colors, value) => ({ ...colors, label: { ...colors.label, inverted: value } })
            },
            {
                key: 'label.hint',
                getValue: colors => colors.label.hint,
                setValue: (colors, value) => ({ ...colors, label: { ...colors.label, hint: value } })
            }
        ]
    },
    {
        key: 'cells',
        tokens: [
            {
                key: 'cell.active',
                getValue: colors => colors.cell.active,
                setValue: (colors, value) => ({ ...colors, cell: { ...colors.cell, active: value } })
            },
            {
                key: 'cell.activeText',
                getValue: colors => colors.cell.activeText,
                setValue: (colors, value) => ({ ...colors, cell: { ...colors.cell, activeText: value } })
            },
            {
                key: 'cell.highlighted',
                getValue: colors => colors.cell.highlighted,
                setValue: (colors, value) => ({ ...colors, cell: { ...colors.cell, highlighted: value } })
            },
            {
                key: 'cell.highlightedText',
                getValue: colors => colors.cell.highlightedText,
                setValue: (colors, value) => ({ ...colors, cell: { ...colors.cell, highlightedText: value } })
            },
            {
                key: 'cell.activeValue',
                getValue: colors => colors.cell.activeValue,
                setValue: (colors, value) => ({ ...colors, cell: { ...colors.cell, activeValue: value } })
            },
            {
                key: 'cell.activeValueText',
                getValue: colors => colors.cell.activeValueText,
                setValue: (colors, value) => ({ ...colors, cell: { ...colors.cell, activeValueText: value } })
            },
            {
                key: 'cell.error',
                getValue: colors => colors.cell.error,
                setValue: (colors, value) => ({ ...colors, cell: { ...colors.cell, error: value } })
            },
            {
                key: 'cell.emptyValueText',
                getValue: colors => colors.cell.emptyValueText,
                setValue: (colors, value) => ({ ...colors, cell: { ...colors.cell, emptyValueText: value } })
            },
            {
                key: 'cell.filled',
                getValue: colors => colors.cell.filled,
                setValue: (colors, value) => ({ ...colors, cell: { ...colors.cell, filled: value } })
            }
        ]
    },
    {
        key: 'candidates',
        tokens: [
            {
                key: 'candidate.border',
                getValue: colors => colors.candidate.border,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, border: value } })
            },
            {
                key: 'candidate.borderActive',
                getValue: colors => colors.candidate.borderActive,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, borderActive: value } })
            },
            {
                key: 'candidate.text',
                getValue: colors => colors.candidate.text,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, text: value } })
            },
            {
                key: 'candidate.textActive',
                getValue: colors => colors.candidate.textActive,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, textActive: value } })
            },
            {
                key: 'candidate.bg',
                getValue: colors => colors.candidate.bg,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, bg: value } })
            },
            {
                key: 'candidate.bgActive',
                getValue: colors => colors.candidate.bgActive,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, bgActive: value } })
            }
        ]
    },
    {
        key: 'numpad',
        tokens: [
            {
                key: 'value.border',
                getValue: colors => colors.value.border,
                setValue: (colors, value) => ({ ...colors, value: { ...colors.value, border: value } })
            },
            {
                key: 'value.progress',
                getValue: colors => colors.value.progress,
                setValue: (colors, value) => ({ ...colors, value: { ...colors.value, progress: value } })
            },
            {
                key: 'value.progressActive',
                getValue: colors => colors.value.progressActive,
                setValue: (colors, value) => ({ ...colors, value: { ...colors.value, progressActive: value } })
            },
            {
                key: 'value.progressActiveText',
                getValue: colors => colors.value.progressActiveText,
                setValue: (colors, value) => ({ ...colors, value: { ...colors.value, progressActiveText: value } })
            },
            {
                key: 'value.text',
                getValue: colors => colors.value.text,
                setValue: (colors, value) => ({ ...colors, value: { ...colors.value, text: value } })
            }
        ]
    },
    {
        key: 'surfaces',
        tokens: [
            {
                key: 'surface.raised',
                getValue: colors => colors.surface.raised,
                setValue: (colors, value) => ({ ...colors, surface: { ...colors.surface, raised: value } })
            },
            {
                key: 'surface.raisedText',
                getValue: colors => colors.surface.raisedText,
                setValue: (colors, value) => ({ ...colors, surface: { ...colors.surface, raisedText: value } })
            },
            {
                key: 'surface.subtle',
                getValue: colors => colors.surface.subtle,
                setValue: (colors, value) => ({ ...colors, surface: { ...colors.surface, subtle: value } })
            },
            {
                key: 'surface.subtleText',
                getValue: colors => colors.surface.subtleText,
                setValue: (colors, value) => ({ ...colors, surface: { ...colors.surface, subtleText: value } })
            },
            {
                key: 'surface.subtleHint',
                getValue: colors => colors.surface.subtleHint,
                setValue: (colors, value) => ({ ...colors, surface: { ...colors.surface, subtleHint: value } })
            }
        ]
    }
];
