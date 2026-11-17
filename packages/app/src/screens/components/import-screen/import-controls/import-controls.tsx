import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { isDefined } from '@rnw-community/shared';

import { useReduceMotion } from '../../../../@generic/hooks/use-reduce-motion.hook';
import { HiddenFromAccessibilityPropsConstant } from '../../../../game/constant/hidden-from-accessibility-props.constant';
import { ImportCellPad } from '../import-cell-pad/import-cell-pad';
import { ImportEntryKind } from '../import-entry-kind/import-entry-kind';

import { ImportControlsStyles as styles } from './import-controls.styles';

import type { ImportReviewStateInterface } from '../interface/import-review-state.interface';

const fadeDurationMs = 160;
const digitPattern = /[1-9]/u;

interface Props {
    readonly puzzleString: string;
    readonly review: ImportReviewStateInterface;
    readonly onInput: (value: number) => void;
    readonly onToggle: () => void;
}

export const ImportControls = ({ puzzleString, review, onInput, onToggle }: Props) => {
    const { entryString, scannedCellIndexes, selectedCellIndex } = review;
    const isMotionReduced = useReduceMotion();

    const isIdle = !isDefined(selectedCellIndex);
    const isEntry = !isIdle && digitPattern.test(entryString[selectedCellIndex]);
    const isEntryKindHidden =
        isIdle || !scannedCellIndexes.includes(selectedCellIndex) || !(isEntry || digitPattern.test(puzzleString[selectedCellIndex]));
    const fade = { transitionDuration: isMotionReduced ? 0 : fadeDurationMs, transitionProperty: 'opacity' as const };
    const keysStyles = [styles.keys, fade, { opacity: isIdle ? 0 : 1 }];
    const entryKindStyles = [fade, { opacity: isEntryKindHidden ? 0 : 1 }];
    const keysPointerEvents = isIdle ? 'none' : 'auto';
    const entryKindPointerEvents = isEntryKindHidden ? 'none' : 'auto';

    return (
        <View style={styles.controls}>
            <Animated.View pointerEvents={keysPointerEvents} style={keysStyles} {...(isIdle && HiddenFromAccessibilityPropsConstant)}>
                <Animated.View
                    pointerEvents={entryKindPointerEvents}
                    style={entryKindStyles}
                    {...(isEntryKindHidden && HiddenFromAccessibilityPropsConstant)}
                >
                    <ImportEntryKind isEntry={isEntry} onToggle={onToggle} />
                </Animated.View>
                <ImportCellPad isDisabled={isIdle} onInput={onInput} />
            </Animated.View>
        </View>
    );
};
