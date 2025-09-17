import { useLingui } from '@lingui/react/macro';

import { gameResetAction } from '../../../game/store/game.actions';
import { useAppDispatch } from '../../hooks/use-app-dispatch.hook';
import { BlackButton } from '../black-button/black-button';

export const PlayAgainButton = () => {
    const { t } = useLingui();

    const dispatch = useAppDispatch();

    const handlePlayAgain = () => void dispatch(gameResetAction());

    return <BlackButton href="/" onPress={handlePlayAgain} replace text={t`Play again`} />;
};
