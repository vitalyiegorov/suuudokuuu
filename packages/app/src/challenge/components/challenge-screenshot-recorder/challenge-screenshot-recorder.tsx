import { useScreenshotListener } from 'expo-screen-capture';

import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { gameScreenshotAction } from '../../../game/store/game.actions';

export const ChallengeScreenshotRecorder = () => {
    const dispatch = useAppDispatch();

    useScreenshotListener(() => void dispatch(gameScreenshotAction()));

    return null;
};
