import { useLingui } from '@lingui/react/macro';
import { FlatList, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { Header } from '../../../@generic/components/header/header';
import { ReturnButton } from '../../../@generic/components/return-button/return-button';
import { useAppSelector } from '../../../@generic/hooks/use-app-selector.hook';
import { getDifficultyText } from '../../../@generic/utils/get-difficulty-text.util';
import { gameCompletedGamesSelector } from '../../../game/store/game.selectors';
import { CompletedGameItem } from '../../../history/components/completed-games-list/completed-game-item';

import { HistoryGamesScreenStyles as styles } from './history-games-screen.styles';

import type { CompletedGameInterface } from '../../../history/interfaces/completed-game.interface';
import type { DifficultyEnum } from '@suuudokuuu/generator';

interface Props {
    readonly difficulty: DifficultyEnum;
}

export const HistoryGamesScreen = ({ difficulty }: Props) => {
    const { t } = useLingui();
    const completedGames = useAppSelector(gameCompletedGamesSelector(difficulty));

    const renderItem = ({ item }: { item: CompletedGameInterface }) => <CompletedGameItem game={item} />;
    const keyExtractor = (item: CompletedGameInterface) => String(item.completedAt);

    return (
        <View style={styles.container}>
            <Header text={`${getDifficultyText(difficulty)} ${t`Games`}`} />
            {completedGames.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <BlackText style={styles.emptyText}>{t`No completed games yet`}</BlackText>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContent}
                    data={completedGames}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    style={styles.list}
                />
            )}
            <ReturnButton />
        </View>
    );
};
