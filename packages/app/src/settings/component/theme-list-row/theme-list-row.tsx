import { useLingui } from '@lingui/react/macro';
import { AppButton, AppSettingsRow } from '@suuudokuuu/ui';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ThemeListRowStyles as styles } from './theme-list-row.styles';

import type { OnEventFn } from '@rnw-community/shared';

interface Props {
    readonly description?: string;
    readonly editLabel: string;
    readonly isSelected: boolean;
    readonly onEdit?: OnEventFn;
    readonly onPress: OnEventFn;
    readonly testID?: string;
    readonly title: string;
}

export const ThemeListRow = ({ description, editLabel, isSelected, onEdit, onPress, testID, title }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    const activeLabelStyle = { color: theme.colors.surface.subtleText };
    const hasEditAction = isDefined(onEdit);
    const accessibilityState = { selected: isSelected };

    const trailing = (
        <View style={styles.trailing}>
            {isSelected && <BlackText style={activeLabelStyle}>{t`Active`}</BlackText>}
            {hasEditAction && <AppButton onPress={onEdit} size="compact" text={editLabel} variant="secondary" />}
        </View>
    );

    return (
        <Pressable
            accessibilityLabel={title}
            accessibilityRole="button"
            accessibilityState={accessibilityState}
            onPress={onPress}
            style={styles.pressable}
            testID={testID}
        >
            <AppSettingsRow description={description} title={title} trailing={trailing} />
        </Pressable>
    );
};
