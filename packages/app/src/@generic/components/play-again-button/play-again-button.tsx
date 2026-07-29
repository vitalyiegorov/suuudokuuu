import { useLingui } from '@lingui/react/macro';

import { isDefined } from '@rnw-community/shared';

import { gameResetAction } from '../../../game/store/game.actions';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import { BlackButton } from '../black-button/black-button';

import { PlayAgainButtonSelectors } from './play-again-button.selectors';

import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly isLoading?: boolean;
    readonly onPress?: PressableProps['onPress'];
    readonly style?: StyleProp<ViewStyle>;
}

export const PlayAgainButton = ({ isLoading = false, onPress, style }: Props) => {
    const { t } = useLingui();

    const dispatch = useAppDispatch();

    const handlePlayAgain = () => void dispatch(gameResetAction());
    const hasCustomOnPress = isDefined(onPress);
    const buttonActionProps = hasCustomOnPress ? { onPress } : { href: '/', onPress: handlePlayAgain, replace: true };

    return (
        <BlackButton
            {...buttonActionProps}
            isLoading={isLoading}
            style={style}
            testID={PlayAgainButtonSelectors.Root}
            text={t`Play again`}
        />
    );
};
