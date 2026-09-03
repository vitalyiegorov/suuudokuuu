import { useLingui } from '@lingui/react/macro';
import LucideHandHelping from 'lucide-react-native/icons/hand-helping';
import { use } from 'react';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { useAppDispatch } from '../../../@generic/hooks/use-app-dispatch.hook';
import { GameScreenSelectors } from '../../../screens/components/game-screen/game-screen.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { gameToggleAutoCandidatesAction } from '../../store/game.actions';
import { gameGetInputStatePayload } from '../../utils/game-get-input-state-payload.util';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly sizeStyle: StyleProp<ViewStyle>;
}

export const AutoCandidatesButton = ({ sizeStyle }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { engine, snapshot } = use(GameContext);

    const dispatch = useAppDispatch();

    const handleCandidates = () => {
        engine.toggleShowAutoCandidates();
        dispatch(gameToggleAutoCandidatesAction(gameGetInputStatePayload(engine)));
    };

    const isActive = !snapshot.showAutoCandidates;
    const buttonVariant = isActive ? 'inverted' : 'primary';
    const iconColor = isActive ? theme.colors.surface.raisedText : theme.colors.inkText;
    const autoCandidatesAccessibilityState = { checked: snapshot.showAutoCandidates };

    return (
        <AppIconButton
            accessibilityLabel={t`Show all candidates`}
            accessibilityRole="togglebutton"
            accessibilityState={autoCandidatesAccessibilityState}
            onPress={handleCandidates}
            style={sizeStyle}
            testID={GameScreenSelectors.TipsButton}
            variant={buttonVariant}
        >
            <LucideHandHelping color={iconColor} />
        </AppIconButton>
    );
};
