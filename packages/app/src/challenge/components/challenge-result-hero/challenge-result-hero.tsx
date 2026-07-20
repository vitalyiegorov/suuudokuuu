import { AppSurfaceCard } from '@suuudokuuu/ui';
import { use } from 'react';
import { View } from 'react-native';

import { Header } from '../../../@generic/components/header/header';
import { ThemeContext } from '../../../theme/context/theme.context';
import { ChallengeResultScore } from '../challenge-result-score/challenge-result-score';

import { ChallengeResultHeroStyles as styles } from './challenge-result-hero.styles';

import type { LucideProps } from 'lucide-react-native';
import type { FC } from 'react';

interface Props {
    readonly headerText: string;
    readonly icon: FC<LucideProps>;
    readonly iconColor: string;
    readonly scoreText: string;
}

export const ChallengeResultHero = ({ headerText, icon: Icon, iconColor, scoreText }: Props) => {
    const { theme } = use(ThemeContext);
    const headerStyles = [styles.header, { color: theme.colors.label.inverted }];
    const iconFrameStyles = [styles.iconFrame, { borderColor: theme.colors.white05 }];

    return (
        <AppSurfaceCard size="compact" style={styles.hero} variant="inverted">
            <View style={styles.heroOutcome}>
                <View style={iconFrameStyles}>
                    <Icon color={iconColor} size={30} />
                </View>
                <Header style={headerStyles} text={headerText} />
            </View>

            <ChallengeResultScore scoreText={scoreText} />
        </AppSurfaceCard>
    );
};
