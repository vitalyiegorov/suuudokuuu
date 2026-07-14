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
    const warningContainerStyle = [styles.warning, warningStyle];
    const warningHeadingStyle = [styles.warningHeading, textStyle];

    return (
        <AppSurfaceCard size="spacious" style={styles.card} variant="muted">
            <View style={styles.section}>
                <Text selectable style={headingStyle}>
                    <Trans>iOS installation</Trans>
                </Text>
                <Text selectable style={copyStyle}>
                    <Trans>
                        Open this page in Safari on a physical iPhone or iPad. The device must already be registered in the Ad Hoc
                        provisioning profile.
                    </Trans>
                </Text>
            </View>

            <View style={styles.section}>
                <Text selectable style={headingStyle}>
                    <Trans>Android installation</Trans>
                </Text>
                <Text selectable style={copyStyle}>
                    <Trans>
                        Your browser may ask for permission to install unknown apps. Android will also show an operating-system security
                        warning before installation.
                    </Trans>
                </Text>
            </View>

            <View accessibilityRole="alert" style={warningContainerStyle}>
                <Text selectable style={warningHeadingStyle}>
                    <Trans>Development client required</Trans>
                </Text>
                <Text selectable style={copyStyle}>
                    <Trans>
                        Development clients need Metro, the default launch URL, or a compatible development-channel update. This install
                        flow does not publish an update.
                    </Trans>
                </Text>
            </View>
        </AppSurfaceCard>
    );
};
