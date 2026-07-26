import { LucideHandHelping } from 'lucide-react-native';
import { use } from 'react';

import { BlackIconButton } from '../../../@generic/components/black-icon-button/black-icon-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { GameScreenSelectors } from '../../../screens/components/game-screen/game-screen.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { gameToggleAutoCandidatesAction } from '../../store/game.actions';
import { gameSelector } from '../../store/game.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly sizeStyle: StyleProp<ViewStyle>;
}

export const AutoCandidatesButton = ({ sizeStyle }: Props) => {
    const { theme } = use(ThemeContext);

    const dispatch = useAppDispatch();
    const { showAutoCandidates } = useAppSelector(gameSelector);

    const handleCandidates = () => {
        dispatch(gameToggleAutoCandidatesAction());
    };

    const isActive = !showAutoCandidates;
    const iconColor = isActive ? theme.colors.surface.raisedText : theme.colors.label.inverted;

    return (
        <BlackIconButton isActive={isActive} onPress={handleCandidates} style={sizeStyle} testID={GameScreenSelectors.TipsButton}>
            <LucideHandHelping color={iconColor} />
        </BlackIconButton>
    );
};
