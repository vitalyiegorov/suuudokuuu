import { useEffect } from 'react';

import { useAppDispatch } from '../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../@generic/hooks/use-app-selector.hook';
import { hellPuzzleGeneratorService } from '../services/hell-puzzle-generator.service';
import { gameAddHellPuzzlesAction } from '../store/game.actions';
import { gameHellPuzzlesCountSelector } from '../store/game.selectors';


export const useHellPuzzleGenerator = () => {
    const dispatch = useAppDispatch();
    const hellPuzzlesCount = useAppSelector(gameHellPuzzlesCountSelector);

    useEffect(() => {
        // Start generating puzzles if we have less than 10
        if (hellPuzzlesCount < 10) {
            hellPuzzleGeneratorService.startGenerating((puzzle: string) => {
                dispatch(gameAddHellPuzzlesAction([puzzle]));
            });
        }

        return () => {
            hellPuzzleGeneratorService.stopGenerating();
        };
    }, [dispatch, hellPuzzlesCount]);

    return hellPuzzlesCount;
};
