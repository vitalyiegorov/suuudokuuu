import { Trans } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HistoryEmptyStateStyles as styles } from './history-empty-state.styles';

interface Props {
    readonly message: string;
    readonly title: string;
}

export const HistoryEmptyState = ({ message, title }: Props) => {
    const { theme } = use(ThemeContext);

    const containerStyles = [styles.container, { backgroundColor: theme.colors.candidate.fill, borderColor: theme.colors.surface.border }];
    const messageStyles = [styles.message, { color: theme.colors.text.hint }];

    return (
        <View style={containerStyles}>
            <BlackText style={styles.title}>{title}</BlackText>
            <BlackText style={messageStyles}>{message}</BlackText>
            <BlackText style={messageStyles}>
                <Trans>Finish a puzzle and it will appear here.</Trans>
            </BlackText>
        </View>
    );
};
