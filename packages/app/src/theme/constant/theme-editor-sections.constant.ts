import type { ThemeEditorSectionInterface } from '../interface/theme-editor-token.interface';

export const ThemeEditorSections: readonly ThemeEditorSectionInterface[] = [
    {
        key: 'general',
        tokens: [
            { key: 'background', getValue: colors => colors.background, setValue: (colors, value) => ({ ...colors, background: value }) },
            { key: 'ink', getValue: colors => colors.ink, setValue: (colors, value) => ({ ...colors, ink: value }) },
            { key: 'inkText', getValue: colors => colors.inkText, setValue: (colors, value) => ({ ...colors, inkText: value }) },
            {
                key: 'overlayLight',
                getValue: colors => colors.overlayLight,
                setValue: (colors, value) => ({ ...colors, overlayLight: value })
            },
            {
                key: 'overlayDark',
                getValue: colors => colors.overlayDark,
                setValue: (colors, value) => ({ ...colors, overlayDark: value })
            },
            { key: 'danger', getValue: colors => colors.danger, setValue: (colors, value) => ({ ...colors, danger: value }) },
            {
                key: 'dangerText',
                getValue: colors => colors.dangerText,
                setValue: (colors, value) => ({ ...colors, dangerText: value })
            },
            { key: 'accent', getValue: colors => colors.accent, setValue: (colors, value) => ({ ...colors, accent: value }) }
        ]
    },
    {
        key: 'labels',
        tokens: [
            {
                key: 'text.primary',
                getValue: colors => colors.text.primary,
                setValue: (colors, value) => ({ ...colors, text: { ...colors.text, primary: value } })
            },
            {
                key: 'text.hint',
                getValue: colors => colors.text.hint,
                setValue: (colors, value) => ({ ...colors, text: { ...colors.text, hint: value } })
            }
        ]
    },
    {
        key: 'cells',
        tokens: [
            {
                key: 'board.selected',
                getValue: colors => colors.board.selected,
                setValue: (colors, value) => ({ ...colors, board: { ...colors.board, selected: value } })
            },
            {
                key: 'board.selectedText',
                getValue: colors => colors.board.selectedText,
                setValue: (colors, value) => ({ ...colors, board: { ...colors.board, selectedText: value } })
            },
            {
                key: 'board.sameValue',
                getValue: colors => colors.board.sameValue,
                setValue: (colors, value) => ({ ...colors, board: { ...colors.board, sameValue: value } })
            },
            {
                key: 'board.sameValueText',
                getValue: colors => colors.board.sameValueText,
                setValue: (colors, value) => ({ ...colors, board: { ...colors.board, sameValueText: value } })
            },
            {
                key: 'board.error',
                getValue: colors => colors.board.error,
                setValue: (colors, value) => ({ ...colors, board: { ...colors.board, error: value } })
            },
            {
                key: 'board.filled',
                getValue: colors => colors.board.filled,
                setValue: (colors, value) => ({ ...colors, board: { ...colors.board, filled: value } })
            },
            {
                key: 'board.emptyText',
                getValue: colors => colors.board.emptyText,
                setValue: (colors, value) => ({ ...colors, board: { ...colors.board, emptyText: value } })
            }
        ]
    },
    {
        key: 'candidates',
        tokens: [
            {
                key: 'candidate.text',
                getValue: colors => colors.candidate.text,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, text: value } })
            },
            {
                key: 'candidate.textSelected',
                getValue: colors => colors.candidate.textSelected,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, textSelected: value } })
            },
            {
                key: 'candidate.fill',
                getValue: colors => colors.candidate.fill,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, fill: value } })
            },
            {
                key: 'candidate.fillSelected',
                getValue: colors => colors.candidate.fillSelected,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, fillSelected: value } })
            },
            {
                key: 'candidate.borderSelected',
                getValue: colors => colors.candidate.borderSelected,
                setValue: (colors, value) => ({ ...colors, candidate: { ...colors.candidate, borderSelected: value } })
            }
        ]
    },
    {
        key: 'numpad',
        tokens: [
            {
                key: 'numpad.track',
                getValue: colors => colors.numpad.track,
                setValue: (colors, value) => ({ ...colors, numpad: { ...colors.numpad, track: value } })
            },
            {
                key: 'numpad.trackFilled',
                getValue: colors => colors.numpad.trackFilled,
                setValue: (colors, value) => ({ ...colors, numpad: { ...colors.numpad, trackFilled: value } })
            },
            {
                key: 'numpad.trackFilledText',
                getValue: colors => colors.numpad.trackFilledText,
                setValue: (colors, value) => ({ ...colors, numpad: { ...colors.numpad, trackFilledText: value } })
            },
            {
                key: 'numpad.text',
                getValue: colors => colors.numpad.text,
                setValue: (colors, value) => ({ ...colors, numpad: { ...colors.numpad, text: value } })
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
            },
            {
                key: 'surface.border',
                getValue: colors => colors.surface.border,
                setValue: (colors, value) => ({ ...colors, surface: { ...colors.surface, border: value } })
            }
        ]
    }
];
