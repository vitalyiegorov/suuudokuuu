import { useLingui } from '@lingui/react/macro';
import { AppButton } from '@suuudokuuu/ui';
import { LucidePlay, LucideShare2 } from 'lucide-react-native';
import { type PressableProps, View } from 'react-native';

import { PauseScreenSelectors } from '../pause-screen.selectors';

import { PauseScreenActionsStyles as styles } from './pause-screen-actions.styles';

interface Props {
    readonly onQuit: NonNullable<PressableProps['onPress']>;
    readonly onResume: NonNullable<PressableProps['onPress']>;
    readonly onShare: NonNullable<PressableProps['onPress']>;
}

export const PauseScreenActions = ({ onQuit, onResume, onShare }: Props) => {
    const { t } = useLingui();

    return (
        <View style={styles.container}>
            <View style={styles.secondaryActions}>
                <AppButton
                    icon={LucideShare2}
                    iconSize={18}
                    onPress={onShare}
                    size="compact"
                    style={styles.secondaryButton}
                    testID={PauseScreenSelectors.ShareButton}
                    text={t`Share puzzle`}
                    textStyle={styles.secondaryButtonText}
                    variant="secondary"
                />

                <AppButton
                    onPress={onQuit}
                    size="compact"
                    style={styles.secondaryButton}
                    testID={PauseScreenSelectors.QuitButton}
                    text={t`Quit`}
                    textStyle={styles.secondaryButtonText}
                    variant="danger"
                />
            </View>

            <AppButton
                icon={LucidePlay}
                iconSize={18}
                onPress={onResume}
                style={styles.primaryButton}
                testID={PauseScreenSelectors.ResumeButton}
                text={t`Continue`}
                textStyle={styles.primaryButtonText}
                variant="primary"
            />
        </View>
    );
};
