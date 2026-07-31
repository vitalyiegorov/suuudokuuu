import { Trans, useLingui } from '@lingui/react/macro';
import { AppSurfaceCard } from '@suuudokuuu/ui';
import * as Linking from 'expo-linking';
import { LucideExternalLink } from 'lucide-react-native';
import { use } from 'react';
import { Alert, Text, View } from 'react-native';

import { AppLinkButton } from '../../../../../@generic/components/app-link-button/app-link-button';
import { ThemeContext } from '../../../../../theme/context/theme.context';
import { BetaScreenSelectors } from '../../beta-screen.selectors';
import { BetaCommitUrlPrefix } from '../../constant/beta-url.constant';
import { formatBetaDate } from '../../utils/format-beta-date.util';

import { BetaReleaseDetailsStyles as styles } from './beta-release-details.styles';

import type { BetaRelease } from '../../schema/beta-release.schema';

interface Props {
    readonly release: BetaRelease;
}

export const BetaReleaseDetails = ({ release }: Props) => {
    const { i18n, t } = useLingui();
    const { theme } = use(ThemeContext);
    const textStyle = { color: theme.colors.text.primary };
    const hintStyle = { color: theme.colors.text.hint };
    const builtAt = formatBetaDate(release.builtAt, i18n.locale);
    const publishedAt = formatBetaDate(release.publishedAt, i18n.locale);
    const commitUrl = `${BetaCommitUrlPrefix}${release.commitSha}`;
    const { commitShortSha } = release;
    const headingStyle = [styles.heading, textStyle];
    const valueHintStyle = [styles.value, hintStyle];
    const sectionLabelStyle = [styles.label, hintStyle];
    const notesStyle = [styles.notes, textStyle];
    const checksumLabelStyle = [styles.checksumLabel, hintStyle];
    const checksumStyle = [styles.checksum, textStyle];

    const handleOpenError = () => {
        Alert.alert(t`Unable to open link`, t`The commit link could not be opened on this device.`);
    };
    const handleCommitPress = () => {
        Linking.openURL(commitUrl).catch(handleOpenError);
    };

    return (
        <AppSurfaceCard size="spacious" style={styles.card}>
            <View style={styles.section}>
                <Text selectable style={headingStyle}>
                    {release.name} · {release.version}
                </Text>
                <View style={styles.metadata}>
                    <Text selectable style={valueHintStyle}>
                        <Trans>Built:</Trans> {builtAt}
                    </Text>
                    <Text selectable style={valueHintStyle}>
                        <Trans>Published:</Trans> {publishedAt}
                    </Text>
                </View>
                <AppLinkButton
                    accessibilityHint={t`Opens this commit on GitHub`}
                    accessibilityLabel={t`Open commit ${commitShortSha} on GitHub`}
                    accessibilityRole="link"
                    icon={LucideExternalLink}
                    onPress={handleCommitPress}
                    size="compact"
                    style={styles.commitButton}
                    testID={BetaScreenSelectors.CommitButton}
                    text={t`Commit ${commitShortSha}`}
                    variant="secondary"
                />
            </View>

            <View style={styles.section}>
                <Text style={sectionLabelStyle}>
                    <Trans>Release notes</Trans>
                </Text>
                <Text selectable style={notesStyle}>
                    {release.releaseNotes}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={sectionLabelStyle}>
                    <Trans>SHA-256 checksums</Trans>
                </Text>
                <View style={styles.checksumGroup}>
                    <Text style={checksumLabelStyle}>IPA</Text>
                    <Text selectable style={checksumStyle}>
                        {release.checksums.ipa}
                    </Text>
                </View>
                <View style={styles.checksumGroup}>
                    <Text style={checksumLabelStyle}>APK</Text>
                    <Text selectable style={checksumStyle}>
                        {release.checksums.apk}
                    </Text>
                </View>
            </View>
        </AppSurfaceCard>
    );
};
