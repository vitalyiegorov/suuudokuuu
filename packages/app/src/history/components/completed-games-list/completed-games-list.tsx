import { useLingui } from '@lingui/react/macro';
import { View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { gameCompletedGamesSelector } from '../../../game/store/game.selectors';

import { CompletedGameItem } from './completed-game-item';
import { CompletedGamesListStyles as styles } from './completed-games-list.styles';

import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const CompletedGamesList = ({ difficulty }: Props) => {
    const { t } = useLingui();
    const completedGames = useAppSelector(gameCompletedGamesSelector(difficulty));

    if (completedGames.length === 0) {
        return (
            <View style={styles.container}>
                <BlackText style={styles.emptyText}>{t`No completed games yet`}</BlackText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {completedGames.map(game => (
                <CompletedGameItem game={game} key={game.completedAt} />
            ))}
        </View>
    );
};
