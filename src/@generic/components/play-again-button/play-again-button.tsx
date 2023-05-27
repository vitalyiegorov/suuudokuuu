import { gameResetAction } from '../../../game';
import { useAppDispatch } from '../../hooks/redux.hook';
import { BlackButton } from '../black-button/black-button';

export const PlayAgainButton = () => {
    const dispatch = useAppDispatch();

    const handlePlayAgain = () => {
        dispatch(gameResetAction());
    };

    return <BlackButton text="Play again" onPress={handlePlayAgain} href="/" />;
};
