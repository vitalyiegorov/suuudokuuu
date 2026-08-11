import { DifficultyEnum } from '@suuudokuuu/generator';
import { router } from 'expo-router';
import { View } from 'react-native';

import { isPositiveNumber } from '@rnw-community/shared';

import { RatingBadge } from '../../../../@generic/components/rating-badge/rating-badge';
import { useAppSelector } from '../../../../@generic/hooks/use-app-selector.hook';
import { getRatingExplainerHref } from '../../../../@generic/utils/get-rating-explainer-href.util';
import { AutoCandidatesButton } from '../../../../game/components/auto-candidates-button/auto-candidates-button';
import { InputModeButton } from '../../../../game/components/input-mode-button/input-mode-button';
import { gameDifficultySelector, gameIsRatingCeilingSelector, gameRatingSelector } from '../../../../game/store/game.selectors';
import { GameScreenSelectors } from '../game-screen.selectors';

import { GameInputToolsStyles as styles } from './game-input-tools.styles';

interface Props {
    readonly hideAutoCandidates: boolean;
}

export const GameInputTools = ({ hideAutoCandidates }: Props) => {
    const difficulty = useAppSelector(gameDifficultySelector);
    const rating = useAppSelector(gameRatingSelector);
    const isRatingCeiling = useAppSelector(gameIsRatingCeilingSelector);

    const handlePressRating = () => {
        router.push(getRatingExplainerHref(rating, isRatingCeiling));
    };

    const isHellOrInfinityDifficulty = difficulty === DifficultyEnum.Hell || difficulty === DifficultyEnum.Infinity;
    const shouldShowGameRating = isHellOrInfinityDifficulty && isPositiveNumber(rating);

    return (
        <View style={styles.row}>
            <View style={styles.inputControls}>
                <InputModeButton sizeStyle={styles.toolButton} />
                {hideAutoCandidates ? null : <AutoCandidatesButton sizeStyle={styles.toolButton} />}
            </View>

            {shouldShowGameRating && (
                <View style={styles.ratingBadgeSlot} testID={GameScreenSelectors.Rating}>
                    <RatingBadge isCeiling={isRatingCeiling} onPress={handlePressRating} rating={rating} />
                </View>
            )}
        </View>
    );
};
