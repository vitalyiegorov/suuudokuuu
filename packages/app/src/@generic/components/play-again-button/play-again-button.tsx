import { useLingui } from '@lingui/react/macro';

import { isDefined } from '@rnw-community/shared';

import { runCurrentRunCommand } from '../../../game/utils/run-current-run-command.util';
import { AppLinkButton } from '../app-link-button/app-link-button';

import { PlayAgainButtonSelectors } from './play-again-button.selectors';

import type { PressableProps, StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly isLoading?: boolean;
    readonly onPress?: PressableProps['onPress'];
    readonly style?: StyleProp<ViewStyle>;
}

export const PlayAgainButton = ({ isLoading = false, onPress, style }: Props) => {
    const { t } = useLingui();

    const handlePlayAgain = () => void runCurrentRunCommand(currentRunService => currentRunService.reset);
    const hasCustomOnPress = isDefined(onPress);
    const buttonActionProps = hasCustomOnPress ? { onPress } : { href: '/', onPress: handlePlayAgain, replace: true };

    return (
        <AppLinkButton
            {...buttonActionProps}
            isLoading={isLoading}
            style={style}
            testID={PlayAgainButtonSelectors.Root}
            text={t`Play again`}
        />
    );
};
