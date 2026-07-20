import { Trans } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { Text, View } from 'react-native';

import { ThemeContext } from '../../../../../theme/context/theme.context';

import { BetaPlatformInstructionsStyles as styles } from './beta-platform-instructions.styles';

export const BetaPlatformInstructions = () => {
    const { theme } = use(ThemeContext);
    const textStyle = { color: theme.colors.label.main };
    const hintStyle = { color: theme.colors.label.hint };
    const warningStyle = { borderLeftColor: theme.colors.red };
    const headingStyle = [styles.heading, textStyle];
    const copyStyle = [styles.text, hintStyle];
    const codeStyle = [styles.code, textStyle];
    const warningContainerStyle = [styles.warning, warningStyle];
    const warningHeadingStyle = [styles.warningHeading, textStyle];

    return (
        <>
            <AppSurfaceCard size="spacious" style={styles.card} variant="muted">
                <Text selectable style={headingStyle}>
                    <Trans>iOS installation</Trans>
                </Text>
                <Text selectable style={copyStyle}>
                    <Trans>
                        Open this page in Safari on a physical iPhone or iPad. The device must already be registered in the Ad Hoc
                        provisioning profile.
                    </Trans>
                </Text>
            </AppSurfaceCard>

            <AppSurfaceCard size="spacious" style={styles.card} variant="muted">
                <Text selectable style={headingStyle}>
                    <Trans>Android installation</Trans>
                </Text>
                <Text selectable style={copyStyle}>
                    <Trans>
                        Your browser may ask for permission to install unknown apps. Android will also show an operating-system security
                        warning before installation.
                    </Trans>
                </Text>
            </AppSurfaceCard>

            <View accessibilityRole="alert" style={warningContainerStyle}>
                <Trans>
                    <Text selectable style={warningHeadingStyle}>
                        Development client required
                    </Text>
                    <Text selectable style={copyStyle}>
                        Development clients need Metro, the launch URL configured in{' '}
                        <Text selectable style={codeStyle}>
                            EXPO_DEV_CLIENT_DEFAULT_LAUNCH_URL
                        </Text>
                        , or a compatible update on the{' '}
                        <Text selectable style={codeStyle}>
                            development
                        </Text>{' '}
                        channel. This install flow does not publish an update.
                    </Text>
                </Trans>
            </View>
        </>
    );
};
