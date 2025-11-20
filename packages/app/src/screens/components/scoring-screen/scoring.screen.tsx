import { useLingui } from '@lingui/react/macro';
import { use } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Header } from '../../../@generic/components/header/header';
import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { ReturnButton } from '../../../@generic/components/return-button/return-button';
import { defaultScoringConfig } from '../../../scoring/scoring-config.interface';
import { ThemeContext } from '../../../theme/context/theme.context';

import { BonusList } from './bonus-list';
import { DifficultyList } from './difficulty-list';
import { ExampleSection } from './example-section';
import { ListItem } from './list-item';
import { ScoringScreenStyles as styles } from './scoring-screen.styles';
import { TipsList } from './tips-list';

export const ScoringScreen = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const textStyle = { color: theme.colors.label.main };
    const headingStyle = { color: theme.colors.label.main, fontWeight: 'bold' as const, fontSize: 16, marginTop: 16, marginBottom: 8 };
    const codeStyle = { color: theme.colors.blue, fontFamily: 'monospace' };
    const sectionStyle = { marginBottom: 16 };

    return (
        <View style={styles.container}>
            <PageHeader title={t`How Scoring Works`} />
            <Header text={t`How Scoring Works`} />

            <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false} style={styles.scrollView}>
                <View style={sectionStyle}>
                    <Text style={textStyle}>
                        {t`Score is calculated for each correct cell placement based on difficulty, bonuses, and penalties.`}
                    </Text>
                </View>

                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Base Score`}</Text>
                    <Text style={textStyle}>
                        {t`Each correct placement starts with a base value:`} <Text style={codeStyle}>{defaultScoringConfig.correctValue}</Text>
                    </Text>
                    <Text style={textStyle}>{t`This value is multiplied by the difficulty coefficient:`}</Text>
                    <DifficultyList codeStyle={codeStyle} listItemStyle={styles.listItem} t={t} textStyle={textStyle} />
                </View>

                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Completion Bonuses`}</Text>
                    <Text style={textStyle}>{t`Extra points are awarded when your placement completes:`}</Text>
                    <BonusList codeStyle={codeStyle} listItemStyle={styles.listItem} t={t} textStyle={textStyle} />
                </View>

                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Penalties`}</Text>
                    <Text style={textStyle}>{t`Points are deducted for:`}</Text>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • {t`Time`}: <Text style={codeStyle}>{defaultScoringConfig.elapsedCoefficient}</Text> {t`per second`}
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • {t`Mistakes`}: <Text style={codeStyle}>{defaultScoringConfig.mistakesCoefficient}</Text> {t`per mistake`}
                    </ListItem>
                    <Text style={textStyle}>
                        {t`Penalty formula`}: <Text style={codeStyle}>{t`score × coefficient × count`}</Text>
                    </Text>
                </View>

                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Minimum Score`}</Text>
                    <Text style={textStyle}>
                        {t`No matter how many penalties, you always earn at least`}{' '}
                        <Text style={codeStyle}>{defaultScoringConfig.correctMinValue}</Text> {t`points per correct placement.`}
                    </Text>
                </View>

                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Example`}</Text>
                    <ExampleSection codeStyle={codeStyle} listItemStyle={styles.listItem} t={t} textStyle={textStyle} />
                </View>

                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Tips for High Scores`}</Text>
                    <TipsList listItemStyle={styles.listItem} t={t} textStyle={textStyle} />
                </View>
            </ScrollView>

            <ReturnButton />
        </View>
    );
};
