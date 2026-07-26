import { StyleSheet } from 'react-native-unistyles';

import { WideContentWidthMultiplierConstant } from '../../constant/wide-content-width.constant';

import { HomeScreenContentStackCompactGap, HomeScreenContentStackWideGap } from './constant/home-screen.constant';

const HomeScreenStaticStyles = {
    bestRun: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'space-between',
        paddingHorizontal: 2,
        paddingVertical: 8,
        width: '100%'
    },
    bestRunCopy: {
        flex: 1,
        gap: 3,
        minWidth: 0
    },
    bestRunLabel: {
        fontSize: 12,
        fontWeight: '800',
        opacity: 0.46,
        textAlign: 'left',
        textTransform: 'uppercase'
    },
    bestRunLink: {
        width: '100%',
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    bestRunMetric: {
        alignItems: 'flex-end',
        minWidth: 66
    },
    bestRunMetrics: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 20
    },
    bestRunTitle: {
        fontSize: 18,
        fontWeight: '800',
        lineHeight: 23,
        textAlign: 'left'
    },
    content: {
        alignItems: 'stretch'
    },
    continueContent: {
        alignItems: 'center',
        bottom: 0,
        flexDirection: 'row',
        gap: 12,
        left: 0,
        paddingHorizontal: 14,
        position: 'absolute',
        right: 0,
        top: 0
    },
    continueCopy: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        gap: 12,
        minWidth: 0
    },
    continueElapsed: {
        fontSize: 15,
        fontWeight: '800',
        lineHeight: 19,
        textAlign: 'left'
    },
    continueIcon: {
        alignItems: 'center',
        borderRadius: 24,
        height: 40,
        justifyContent: 'center',
        width: 40
    },
    continueProgressFill: {
        height: '100%'
    },
    continueProgressText: {
        fontSize: 18,
        fontWeight: '800',
        lineHeight: 23,
        minWidth: 44,
        textAlign: 'right'
    },
    continueProgressTrack: {
        borderRadius: 23,
        bottom: 0,
        flexDirection: 'row',
        left: 0,
        overflow: 'hidden',
        position: 'absolute',
        right: 0,
        top: 0
    },
    continueRow: {
        borderRadius: 23,
        height: 56,
        overflow: 'hidden',
        width: '100%',
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    continueTitle: {
        flexShrink: 1,
        fontSize: 18,
        fontWeight: '800',
        lineHeight: 23,
        textAlign: 'left'
    },
    fieldGroup: {
        gap: 9,
        width: '100%'
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'left'
    },
    hero: {
        alignItems: 'center',
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'space-between',
        width: '100%'
    },
    historyValue: {
        fontSize: 19,
        fontWeight: '800',
        textAlign: 'right'
    },
    hintText: {
        fontSize: 13,
        lineHeight: 18,
        textAlign: 'left'
    },
    optionCard: {
        borderRadius: 18,
        borderWidth: StyleSheet.hairlineWidth,
        gap: 3,
        minHeight: 64,
        paddingHorizontal: 12,
        paddingVertical: 11,
        _web: {
            cursor: 'pointer',
            _hover: {
                opacity: 0.85
            }
        }
    },
    optionDescription: {
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'left'
    },
    mistakeGrid: {
        flexDirection: 'row',
        gap: 8,
        width: '100%'
    },
    mistakeOptionCard: {
        flex: 1
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'left'
    },
    playActions: {
        alignItems: 'center',
        gap: 14,
        paddingTop: 8,
        width: '100%'
    },
    primaryButton: {
        alignSelf: 'center',
        borderRadius: 999,
        maxWidth: '100%',
        minHeight: 68,
        paddingHorizontal: 24,
        paddingVertical: 12,
        width: '100%'
    },
    scrollView: {
        flex: 1,
        width: '100%'
    },
    statsStrip: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    startButtonContent: {
        alignItems: 'center',
        gap: 2,
        justifyContent: 'center',
        width: '100%'
    },
    startButtonSubtitle: {
        fontSize: 13,
        fontWeight: '700',
        lineHeight: 17,
        opacity: 0.72,
        textAlign: 'center'
    },
    startButtonTitle: {
        fontSize: 20,
        fontWeight: '800',
        lineHeight: 24,
        textAlign: 'center'
    },
    title: {
        flexShrink: 1,
        fontSize: 30,
        lineHeight: 36,
        marginBottom: 0,
        minWidth: 0,
        textAlign: 'left'
    }
} as const;

export const HomeScreenStyles = StyleSheet.create(theme => ({
    ...HomeScreenStaticStyles,
    contentStack: (sizeClass: 'compact' | 'wide') => ({
        alignItems: sizeClass === 'wide' ? 'flex-start' : 'stretch',
        flexDirection: sizeClass === 'wide' ? 'row' : 'column',
        gap: sizeClass === 'wide' ? HomeScreenContentStackWideGap : HomeScreenContentStackCompactGap,
        width: '100%'
    }),
    masthead: (sizeClass: 'compact' | 'wide') => ({
        gap: 16,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    }),
    scrollContent: (sizeClass: 'compact' | 'wide') => ({
        alignItems: 'center',
        alignSelf: 'center',
        maxWidth: sizeClass === 'wide' ? theme.contentWidth.standard * WideContentWidthMultiplierConstant : theme.contentWidth.standard,
        paddingBottom: 28,
        paddingHorizontal: 20,
        width: '100%'
    }),
    setupSection: (sizeClass: 'compact' | 'wide') => ({
        gap: 15,
        ...(sizeClass === 'wide' ? { flex: 1 } : { width: '100%' })
    })
}));
