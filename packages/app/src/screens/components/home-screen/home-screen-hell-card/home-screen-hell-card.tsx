import { plural } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { GameContext } from '../../../../game/context/game.context';
import { hellQueueCountSelector } from '../../../../hell-queue/store/hell-queue.selectors';
import { settingsLastGameChallengeModeSelector, settingsLastGameMaxMistakesSelector } from '../../../../settings/store/settings.selectors';
import { ThemeContext } from '../../../../theme/context/theme.context';

import { HomeScreenHellCardSelectors } from './home-screen-hell-card.selectors';
import { HomeScreenHellCardStyles as styles } from './home-screen-hell-card.styles';

const DisabledCardOpacity = 0.6;
const EnabledCardOpacity = 1;

export const HomeScreenHellCard = () => {
    const { create, isCreatingGame } = use(GameContext);
    const { theme } = use(ThemeContext);
    const hellQueueCount = useAppSelector(hellQueueCountSelector);
    const isChallengeMode = useAppSelector(settingsLastGameChallengeModeSelector);
    const maxMistakes = useAppSelector(settingsLastGameMaxMistakesSelector);

    if (hellQueueCount === 0) {
        return null;
    }

    const handlePress = () => void create({ difficulty: DifficultyEnum.Hell, isChallengeRun: isChallengeMode, maxMistakes });
    const countText = plural(hellQueueCount, { one: '# puzzle ready', other: '# puzzles ready' });
    const cardOpacity = isCreatingGame ? DisabledCardOpacity : EnabledCardOpacity;
    const cardStyles = [styles.card, { backgroundColor: theme.colors.black, borderColor: theme.colors.red, opacity: cardOpacity }];
    const titleStyles = [styles.title, { color: theme.colors.label.inverted }];
    const badgeStyles = [styles.badge, { backgroundColor: theme.colors.red }];
    const badgeTextStyles = [styles.badgeText, { color: theme.colors.redFillText }];

    return (
        <View style={styles.container} testID={HomeScreenHellCardSelectors.Root}>
            <Pressable
                accessibilityRole="button"
                disabled={isCreatingGame}
                onPress={handlePress}
                style={cardStyles}
                testID={HomeScreenHellCardSelectors.Start}
            >
                <BlackText numberOfLines={1} style={titleStyles}>
                    <Trans>Hell</Trans>
                </BlackText>

                <View style={badgeStyles}>
                    <BlackText numberOfLines={1} style={badgeTextStyles} testID={HomeScreenHellCardSelectors.Count}>
                        {countText}
                    </BlackText>
                </View>
            </Pressable>
        </View>
    );
};
