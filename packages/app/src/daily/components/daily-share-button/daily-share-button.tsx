import { useLingui } from '@lingui/react/macro';
import { SharedPayloadKindEnum } from '@suuudokuuu/encoder';
import LucideShare from 'lucide-react-native/icons/share';
import { use } from 'react';

import { AppLinkButton } from '../../../@generic/components/app-link-button/app-link-button';
import { useShareGameState } from '../../../game/hooks/use-share-game-state/use-share-game-state.hook';
import { stringToGameState } from '../../../game/utils/string-to-game-state.util';
import { ThemeContext } from '../../../theme/context/theme.context';

import { DailyShareButtonSelectors } from './daily-share-button.selectors';
import { DailyShareButtonStyles as styles } from './daily-share-button.styles';

const ShareIconSize = 18;

interface Props {
    readonly encodedState: string;
}

export const DailyShareButton = ({ encodedState }: Props) => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const handleShare = useShareGameState(SharedPayloadKindEnum.Puzzle, stringToGameState(encodedState));

    return (
        <AppLinkButton
            accessibilityLabel={t`Share puzzle`}
            onPress={handleShare}
            style={styles.button}
            testID={DailyShareButtonSelectors.Button}
            variant="primary"
        >
            <LucideShare color={theme.colors.inkText} size={ShareIconSize} />
        </AppLinkButton>
    );
};
