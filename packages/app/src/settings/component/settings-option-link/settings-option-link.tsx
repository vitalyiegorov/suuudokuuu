import { useLingui } from '@lingui/react/macro';
import { AppSettingsRow } from '@suuudokuuu/ui';
import { Link } from 'expo-router';
import { use } from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { SettingsOptionLinkStyles as styles } from './settings-option-link.styles';

import type { ComponentProps } from 'react';

interface Props {
    readonly description: string;
    readonly href: ComponentProps<typeof Link>['href'];
    readonly testID?: string;
    readonly title: string;
    readonly value: string;
}

export const SettingsOptionLink = ({ description, href, testID, title, value }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    const valueStyles = [styles.value, { color: theme.colors.text.hint }];
    const trailing = (
        <View style={styles.trailing}>
            <BlackText numberOfLines={1} style={valueStyles}>
                {value}
            </BlackText>
            <Svg fill="none" height={12} opacity={0.6} viewBox="0 0 7 12" width={7}>
                <Path d="m1,1,5,5-5,5" stroke={theme.colors.text.hint} strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} />
            </Svg>
        </View>
    );
    const accessibilityLabel = isNotEmptyString(description) ? `${title}, ${description}` : title;
    const accessibilityHint = t`Opens a picker to change this setting`;
    const accessibilityValue = { text: value };

    return (
        <Link asChild href={href}>
            <Pressable
                accessibilityHint={accessibilityHint}
                accessibilityLabel={accessibilityLabel}
                accessibilityRole="button"
                accessibilityValue={accessibilityValue}
                style={styles.pressable}
                testID={testID}
            >
                <AppSettingsRow description={description} title={title} trailing={trailing} />
            </Pressable>
        </Link>
    );
};
