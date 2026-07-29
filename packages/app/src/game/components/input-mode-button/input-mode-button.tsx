import { LucidePencil } from 'lucide-react-native';
import { use } from 'react';

import { BlackIconButton } from '../../../@generic/components/black-icon-button/black-icon-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameToggleInputModeAction } from '../../store/game.actions';
import { gameInputModeSelector } from '../../store/game.selectors';

import { InputModeButtonSelectors } from './input-mode-button.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly sizeStyle: StyleProp<ViewStyle>;
}

export const InputModeButton = ({ sizeStyle }: Props) => {
    const { theme } = use(ThemeContext);

    const dispatch = useAppDispatch();
    const inputMode = useAppSelector(gameInputModeSelector);

    const handleToggle = () => {
        dispatch(gameToggleInputModeAction());
    };

    const isCandidateMode = inputMode === 'candidate';
    const isActive = !isCandidateMode;
    const iconColor = isActive ? theme.colors.surface.raisedText : theme.colors.label.inverted;

    return (
        <BlackIconButton hitSlop={10} isActive={isActive} onPress={handleToggle} style={sizeStyle} testID={InputModeButtonSelectors.Root}>
            <LucidePencil color={iconColor} />
        </BlackIconButton>
    );
};
