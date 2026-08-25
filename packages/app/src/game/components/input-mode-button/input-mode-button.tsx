import { useLingui } from '@lingui/react/macro';
import { LucidePencil } from 'lucide-react-native';
import { use } from 'react';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { gameToggleInputModeAction } from '../../store/game.actions';
import { gameGetInputStatePayload } from '../../utils/game-get-input-state-payload.util';

import { InputModeButtonSelectors } from './input-mode-button.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly sizeStyle: StyleProp<ViewStyle>;
}

export const InputModeButton = ({ sizeStyle }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { engine, snapshot } = use(GameContext);

    const dispatch = useAppDispatch();

    const handleToggle = () => {
        engine.toggleInputMode();
        dispatch(gameToggleInputModeAction(gameGetInputStatePayload(engine)));
    };

    const isCandidateMode = snapshot.inputMode === 'candidate';
    const isActive = !isCandidateMode;
    const buttonVariant = isActive ? 'inverted' : 'primary';
    const iconColor = isActive ? theme.colors.surface.raisedText : theme.colors.inkText;
    const inputModeAccessibilityState = { checked: isCandidateMode };

    return (
        <AppIconButton
            accessibilityLabel={t`Notes mode`}
            accessibilityRole="togglebutton"
            accessibilityState={inputModeAccessibilityState}
            hitSlop={10}
            onPress={handleToggle}
            style={sizeStyle}
            testID={InputModeButtonSelectors.Root}
            variant={buttonVariant}
        >
            <LucidePencil color={iconColor} />
        </AppIconButton>
    );
};
