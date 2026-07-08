import { AppSettingsRow } from '@suuudokuuu/ui';
import { Link } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { use } from 'react';
import { Pressable, View } from 'react-native';

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

    const chevronColor = theme.colors.label.hint;
    const trailing = (
        <View style={styles.valueContainer}>
            <BlackText numberOfLines={1} style={styles.value}>
                {value}
            </BlackText>
            <ChevronRight color={chevronColor} height={20} style={styles.chevron} width={20} />
        </View>
    );

    return (
        <Link asChild href={href}>
            <Pressable accessibilityRole="button" style={styles.pressable} testID={testID}>
                <AppSettingsRow description={description} title={title} trailing={trailing} />
            </Pressable>
        </Link>
    );
};
