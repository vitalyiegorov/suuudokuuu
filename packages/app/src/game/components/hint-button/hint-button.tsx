import { useLingui } from '@lingui/react/macro';
import LucideLightbulb from 'lucide-react-native/icons/lightbulb';
import { use } from 'react';

import { isDefined } from '@rnw-community/shared';

import { AppIconButton } from '../../../@generic/components/app-icon-button/app-icon-button';
import { useSettings } from '../../../settings/query/use-settings.query';
import { ThemeContext } from '../../../theme/context/theme.context';
import { GameContext } from '../../context/game.context';
import { useHintSearch } from '../../hooks/use-hint-search.hook';
import { useCurrentRun } from '../../query/use-current-run.query';
import { gameIsHintAvailable } from '../../utils/game-is-hint-available.util';

import { HintButtonSelectors } from './hint-button.selectors';

import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
    readonly sizeStyle: StyleProp<ViewStyle>;
}

export const HintButton = ({ sizeStyle }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const { snapshot } = use(GameContext);

    const { difficulty, isChallengeRun } = useCurrentRun();
    const { allowHintsOnHardDifficulties } = useSettings();
    const { isSearchingHint, searchHint } = useHintSearch();

    const handleHint = () => {
        searchHint();
    };

    const isDisabled = isDefined(snapshot.stepScript) || snapshot.isWon;
    const accessibilityLabel = isSearchingHint ? t`Finding a hint` : t`Hint`;
    const iconColor = isDisabled ? theme.colors.text.hint : theme.colors.surface.raisedText;

    if (!gameIsHintAvailable({ difficulty, isChallengeRun, allowHintsOnHardDifficulties })) {
        return null;
    }

    return (
        <AppIconButton
            accessibilityLabel={accessibilityLabel}
            disabled={isDisabled}
            hitSlop={10}
            isLoading={isSearchingHint}
            onPress={handleHint}
            style={sizeStyle}
            testID={HintButtonSelectors.Root}
            variant="inverted"
        >
            <LucideLightbulb color={iconColor} />
        </AppIconButton>
    );
};
