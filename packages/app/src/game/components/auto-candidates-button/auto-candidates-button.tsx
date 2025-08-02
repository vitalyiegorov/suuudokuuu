import { LucideHandHelping } from 'lucide-react-native';
import { use } from 'react';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { GameScreenSelectors } from '../../../screens/components/game-screen/game-screen.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameToggleCandidatesAction } from '../../store/game.actions';
import { gameHasCandidatesSelector } from '../../store/game.selectors';

import { AutoCandidatesButtonStyles } from './auto-candidates-button.styles';

export const AutoCandidatesButton = () => {
    const { theme } = use(ThemeContext);

    const dispatch = useAppDispatch();
    const hasCandidates = useAppSelector(gameHasCandidatesSelector);

    const handleCandidates = () => {
        dispatch(gameToggleCandidatesAction());
    };

    return (
        <BlackButton
            isActive={!hasCandidates}
            onPress={handleCandidates}
            style={AutoCandidatesButtonStyles.autoCandidatesButton}
            testID={GameScreenSelectors.TipsButton}
        >
            <LucideHandHelping color={hasCandidates ? theme.colors.white : theme.colors.black} />
        </BlackButton>
    );
};
