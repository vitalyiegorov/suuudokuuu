import { StyleSheet } from 'react-native';

export const DifficultyComplexitySliderStyles = StyleSheet.create({
    difficultyName: {
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 0,
        lineHeight: 29,
        textAlign: 'left'
    },
    difficultySummary: {
        flex: 1,
        gap: 4
    },
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
        paddingTop: 6
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
    preview: {
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: StyleSheet.hairlineWidth,
        flexDirection: 'row',
        gap: 14,
        minHeight: 104,
        paddingHorizontal: 13,
        paddingVertical: 12,
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
    previewGridFrame: {
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
        justifyContent: 'center',
        padding: 8
    },
    previewMistakeBadge: {
        borderRadius: 999,
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 9,
        paddingVertical: 4
    },
    previewMistakeBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        lineHeight: 13
    },
    previewMistakeDescription: {
        flex: 1,
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'left'
    },
    previewMistakeRow: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8,
        paddingTop: 4,
        width: '100%'
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
    sliderFill: {
        borderRadius: 999,
        height: 4,
        left: 0,
        position: 'absolute',
        top: 18
    },
    sliderRail: {
        height: 40,
        justifyContent: 'center',
        width: '100%'
    },
    sliderTrack: {
        borderRadius: 999,
        height: 4,
        left: 0,
        opacity: 0.35,
        position: 'absolute',
        right: 0,
        top: 18
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
    sliderWrap: {
        gap: 4,
        width: '100%'
    },
    subtitle: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'left'
    },
    title: {
        fontSize: 14,
        fontWeight: '800',
        letterSpacing: 0,
        lineHeight: 18,
        textAlign: 'left'
    }
});
