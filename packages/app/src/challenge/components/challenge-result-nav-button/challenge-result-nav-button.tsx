import { GlassIconButton } from '../../../@generic/components/glass-icon-button/glass-icon-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameResetAction } from '../../../game/store/game.actions';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly testID?: string;
}

export const ChallengeResultNavButton = ({ children, testID }: Props) => {
    const dispatch = useAppDispatch();

    const handlePress = () => void dispatch(gameResetAction());

    return (
        <GlassIconButton href="/" onPress={handlePress} replace testID={testID}>
            {children}
        </GlassIconButton>
    );
};
