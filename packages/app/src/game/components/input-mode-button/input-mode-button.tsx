import { LucidePencil } from 'lucide-react-native';
import { use } from 'react';

import { BlackIconButton } from '../../../@generic/components/black-icon-button/black-icon-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameToggleInputModeAction } from '../../store/game.actions';
import { gameInputModeSelector } from '../../store/game.selectors';

export const InputModeButton = () => {
    const { theme } = use(ThemeContext);

    const dispatch = useAppDispatch();
    const inputMode = useAppSelector(gameInputModeSelector);

    const handleToggle = () => {
        dispatch(gameToggleInputModeAction());
    };

    const isCandidateMode = inputMode === 'candidate';
    const iconColor = isCandidateMode ? theme.colors.white : theme.colors.black;

    return (
        <BlackIconButton hitSlop={10} isActive={!isCandidateMode} onPress={handleToggle} testID="input-mode-button">
            <LucidePencil color={iconColor} />
        </BlackIconButton>
    );
};
