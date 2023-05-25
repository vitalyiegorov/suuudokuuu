import { useAppDispatch } from '../../hooks/redux.hook';
import { appRootResetAction } from '../../store/app-root/app-root.actions';
import { BlackButton } from '../black-button/black-button';

export const PlayAgainButton = () => {
    const dispatch = useAppDispatch();

    const handlePlayAgain = () => {
        dispatch(appRootResetAction());
    };

    return <BlackButton text="Play again" onPress={handlePlayAgain} href="/" />;
};
