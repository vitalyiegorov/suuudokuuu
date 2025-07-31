import React, { use } from 'react';
import { View } from 'react-native';

import { isNotEmptyString } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../@generic/context/theme.context';

import { SettingsGroupStyles as styles } from './settings-switch.styles';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly title: string;
    readonly description?: string;
    readonly children: React.ReactNode;
    readonly hasAnotherRow?: boolean;
}

export const SettingsGroup = ({ title, description, children, hasAnotherRow = false }: Props) => {
    const { theme } = use(ThemeContext);

    const descriptionStyles = [styles.description, { color: theme.text.hint }];
    const containerStyles: StyleProp<ViewStyle> = [styles.container, { flexDirection: hasAnotherRow ? 'column' : 'row' }];

    return (
        <View style={styles.wrapper}>
            <View style={containerStyles}>
                <BlackText style={styles.title}>{title}</BlackText>
                {children}
            </View>
            {isNotEmptyString(description) && <BlackText style={descriptionStyles}>{description}</BlackText>}
        </View>
    );
};
