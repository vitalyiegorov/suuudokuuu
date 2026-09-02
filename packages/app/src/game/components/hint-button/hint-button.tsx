import { useLingui } from '@lingui/react/macro';
import LucideLightbulb from 'lucide-react-native/icons/lightbulb';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { Alert } from '../../../@generic/components/alert/alert';
import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { settingsKeySelector } from '../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { gameDifficultySelector, gameIsChallengeRunSelector } from '../../store/game.selectors';
import { gameFindHintStepScript } from '../../utils/game-find-hint-step-script.util';
import { gameIsHintAvailable } from '../../utils/game-is-hint-available.util';

import { HintButtonSelectors } from './hint-button.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly sizeStyle: StyleProp<ViewStyle>;
}

export const HintButton = ({ sizeStyle }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { engine, snapshot } = use(GameContext);

    const difficulty = useAppSelector(gameDifficultySelector);
    const isChallengeRun = useAppSelector(gameIsChallengeRunSelector);
    const allowHintsOnHardDifficulties = useAppSelector(settingsKeySelector('allowHintsOnHardDifficulties'));

    const handleHint = () => {
        const stepScript = gameFindHintStepScript(engine.Sudoku);

        if (!isDefined(stepScript)) {
            Alert(
                t`No simple technique applies`,
                t`This position needs chains or trial and error, so there is no simple logical step to teach. Nothing was revealed and no score was deducted.`,
                [{ text: t`OK` }]
            );

            return;
        }

        engine.startStepScript(stepScript);
    };

    const isDisabled = isDefined(snapshot.stepScript) || snapshot.isWon;
    const iconColor = isDisabled ? theme.colors.text.hint : theme.colors.surface.raisedText;

    if (!gameIsHintAvailable({ difficulty, isChallengeRun, allowHintsOnHardDifficulties })) {
        return null;
    }

    return (
        <AppIconButton
            accessibilityLabel={t`Hint`}
            disabled={isDisabled}
            hitSlop={10}
            onPress={handleHint}
            style={sizeStyle}
            testID={HintButtonSelectors.Root}
            variant="inverted"
        >
            <LucideLightbulb color={iconColor} />
        </AppIconButton>
    );
};
