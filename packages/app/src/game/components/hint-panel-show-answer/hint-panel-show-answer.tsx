import { Trans } from '@lingui/react/macro';
import { CompactMaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import * as Effect from 'effect/Effect';
import { use } from 'react';
import { Pressable } from 'react-native';

import { emptyFn } from '@rnw-community/shared';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import { GameContext } from '../../context/game.context';
import { runCurrentRunCommand } from '../../utils/run-current-run-command.util';
import { HintPanelSelectors } from '../hint-panel/hint-panel.selectors';

import { HintPanelShowAnswerStyles as styles } from './hint-panel-show-answer.styles';

const showAnswerHitSlop = 12;

export const HintPanelShowAnswer = () => {
    const { engine } = use(GameContext);

    const handleShowAnswer = () => {
        const revealedLevelCount = engine.hintSkipToEnd();

        if (revealedLevelCount > 0) {
            void runCurrentRunCommand(currentRunService =>
                Effect.replicateEffect(currentRunService.revealHintLevel(), revealedLevelCount, { discard: true })
            ).catch(emptyFn);
        }
    };

    return (
        <Pressable
            accessibilityRole="button"
            hitSlop={showAnswerHitSlop}
            onPress={handleShowAnswer}
            style={styles.button}
            testID={HintPanelSelectors.SHOW_ANSWER_BUTTON}
        >
            <BlackText maxFontSizeMultiplier={CompactMaxFontSizeMultiplierConstant} style={styles.text}>
                <Trans>Show answer</Trans>
            </BlackText>
        </Pressable>
    );
};
