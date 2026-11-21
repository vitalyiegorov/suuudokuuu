import { useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';

import { GameContext } from '../../../../game/context/game.context';
import { ImportScreenSelectors } from '../import-screen.selectors';

import { ImportDockStyles as styles } from './import-dock.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly width: number;
    readonly isPlayDisabled: boolean;
    readonly onPlay: () => void;
}

export const ImportDock = ({ children, width, isPlayDisabled, onPlay }: Props) => {
    const { t } = useLingui();
    const { isCreatingGame } = use(GameContext);

    const dockStyles = [styles.dock, { width }];
    const playButtonStyles = [styles.playButton, isPlayDisabled && styles.disabledButton];

    return (
        <View style={dockStyles}>
            {children}
            <AppButton
                disabled={isPlayDisabled}
                isLoading={isCreatingGame}
                onPress={onPlay}
                style={playButtonStyles}
                testID={ImportScreenSelectors.PlayButton}
                textStyle={styles.buttonText}
                text={t`Play`}
            />
        </View>
    );
};
