import { useLingui } from '@lingui/react/macro';

import { AppLinkButton } from '../app-link-button/app-link-button';

import { PlayAgainButtonSelectors } from './play-again-button.selectors';

import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly isLoading?: boolean;
    readonly onPress: PressableProps['onPress'];
    readonly style?: StyleProp<ViewStyle>;
}

export const PlayAgainButton = ({ isLoading = false, onPress, style }: Props) => {
    const { t } = useLingui();

    return (
        <AppLinkButton onPress={onPress} isLoading={isLoading} style={style} testID={PlayAgainButtonSelectors.Root} text={t`Play again`} />
    );
};
