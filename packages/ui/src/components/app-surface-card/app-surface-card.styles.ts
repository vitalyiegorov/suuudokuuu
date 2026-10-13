import { StyleSheet } from 'react-native-unistyles';

export const AppSurfaceCardStyles = StyleSheet.create(theme => ({
    card: {
        backgroundColor: theme.colors.candidate.fill,
        borderColor: theme.colors.surface.border,
        borderCurve: 'continuous',
        borderWidth: 1,
        overflow: 'hidden',
        width: '100%',
        variants: {
            size: {
                compact: {
                    borderRadius: 18,
                    paddingHorizontal: 16,
                    paddingVertical: 14
                },
                spacious: {
                    borderRadius: theme.radius.lg,
                    paddingHorizontal: theme.spacing.lg,
                    paddingVertical: theme.spacing.lg
                }
            },
            variant: {
                muted: {
                    backgroundColor: theme.colors.surface.subtle
                },
                inverted: {
                    backgroundColor: theme.colors.ink,
                    borderColor: theme.colors.ink
                }
            }
        }
    }
}));
