import { LucidePencil } from 'lucide-react-native';
import { use } from 'react';

import { BlackButton } from '../../../@generic/components/black-button/black-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameToggleInputModeAction } from '../../store/game.actions';
import { gameInputModeSelector } from '../../store/game.selectors';

import { InputModeButtonStyles } from './input-mode-button.styles';

export const InputModeButton = () => {
    const { theme } = use(ThemeContext);

    const dispatch = useAppDispatch();
    const inputMode = useAppSelector(gameInputModeSelector);

    const handleToggle = () => {
        dispatch(gameToggleInputModeAction());
    };

    const isCandidateMode = inputMode === 'candidate';

    return (
        <BlackButton isActive={!isCandidateMode} onPress={handleToggle} style={InputModeButtonStyles.button} testID="input-mode-button">
            <LucidePencil color={isCandidateMode ? theme.colors.white : theme.colors.black} />
        </BlackButton>
    );
};
