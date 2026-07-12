import { StyleSheet } from 'react-native-unistyles';

const DifficultyComplexitySliderStaticStyles = {
    header: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'space-between',
        width: '100%'
    },
    optionLabel: {
        fontSize: 10,
        fontWeight: '700',
        lineHeight: 13,
        textAlign: 'center'
    },
    optionLabelCenter: {
        textAlign: 'center'
    },
    optionLabelEnd: {
        textAlign: 'right'
    },
    optionLabelStart: {
        textAlign: 'left'
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    optionTrigger: {
        alignItems: 'center',
        flex: 1,
        minHeight: 30,
        paddingTop: 6,
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    optionTriggerCenter: {
        alignItems: 'center'
    },
    optionTriggerEnd: {
        alignItems: 'flex-end'
    },
    optionTriggerStart: {
        alignItems: 'flex-start'
    },
    panel: {
        gap: 11,
        width: '100%'
    },
    previewCell: {
        borderRadius: 3.5,
        height: 12,
        width: 12
    },
    previewGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        width: 72
    },
    previewMistakeBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        lineHeight: 13
    },
    previewText: {
        flex: 1,
        gap: 3
    },
    previewTitle: {
        fontSize: 22,
        fontWeight: '800',
        letterSpacing: 0,
        lineHeight: 27,
        textAlign: 'left'
    },
    sliderRail: {
        height: 40,
        justifyContent: 'center',
        width: '100%'
    },
    sliderThumb: {
        borderRadius: 13,
        borderWidth: 4,
        height: 26,
        left: 0,
        position: 'absolute',
        top: 7,
        width: 26
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'left'
    }
} as const;

export const DifficultyComplexitySliderStyles = StyleSheet.create(theme => ({
    ...DifficultyComplexitySliderStaticStyles,
    difficultyName: {
        fontSize: theme.typography.size.xl,
        fontWeight: '800',
        letterSpacing: 0,
        lineHeight: 29,
        textAlign: 'left'
    },
    difficultySummary: {
        flex: 1,
        gap: theme.spacing.xs
    },
    preview: {
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: 14,
        minHeight: 104,
        paddingHorizontal: 13,
        paddingVertical: theme.spacing.md,
        width: '100%'
    },
    previewGridFrame: {
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        padding: theme.spacing.sm
    },
    previewMistakeBadge: {
        borderRadius: theme.radius.pill,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 9,
        paddingVertical: theme.spacing.xs
    },
    previewMistakeDescription: {
        flex: 1,
        fontSize: theme.typography.size.xs,
        lineHeight: 16,
        textAlign: 'left'
    },
    previewMistakeRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: theme.spacing.sm,
        paddingTop: theme.spacing.xs,
        width: '100%'
    },
    sliderFill: {
        borderRadius: theme.radius.pill,
        height: 4,
        left: 0,
        position: 'absolute',
        top: 18
    },
    sliderTrack: {
        borderRadius: theme.radius.pill,
        height: 4,
        left: 0,
        opacity: 0.35,
        position: 'absolute',
        right: 0,
        top: 18
    },
    sliderWrap: {
        gap: theme.spacing.xs,
        width: '100%'
    },
    title: {
        fontSize: theme.typography.size.sm,
        fontWeight: '800',
        letterSpacing: 0,
        lineHeight: 18,
        textAlign: 'left'
    }
}));
