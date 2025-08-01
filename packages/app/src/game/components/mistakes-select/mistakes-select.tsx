import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { View } from 'react-native';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { Header } from '../../../@generic/components/header/header';
import { ThemeContext } from '../../../@generic/context/theme.context';

import { MistakesSelectStyles as styles } from './mistakes-select.styles';

import type { OnEventFn } from '@rnw-community/shared';

interface Props {
    readonly onSelect: OnEventFn<number>;
}

export const MistakesSelect = ({ onSelect }: Props) => {
    const { theme } = use(ThemeContext);
    const { t } = useLingui();

    const handlePress = (maxMistakes: number) => () => void onSelect(maxMistakes);

    const hardcoreStyle = [styles.hardcoreText, { color: theme.colors.red }];

    return (
        <View style={styles.wrapper}>
            <Header text={t`Choose your challenge`} />

            <BlackButton onPress={handlePress(99)} style={styles.button} text={t`Immortal`} />
            <BlackButton onPress={handlePress(3)} style={styles.button} text={t`Standard`} />
            <BlackButton onPress={handlePress(0)} style={styles.button} styleText={hardcoreStyle} text={t`Hardcore`} />
        </View>
    );
};
