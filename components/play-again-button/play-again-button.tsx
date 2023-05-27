import { useAppDispatch } from '../../hooks/redux.hook';
import { appRootFinishAction } from '../../store/app-root/app-root.actions';
import { BlackButton } from '../black-button/black-button';

export const PlayAgainButton = () => {
    const dispatch = useAppDispatch();

    const handlePlayAgain = () => {
        dispatch(appRootFinishAction());
    };

    return <BlackButton text="Play again" onPress={handlePlayAgain} href="/" />;
};
