import { Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { use } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Header } from '../../@generic/components/header/header';
import { PageHeader } from '../../@generic/components/page-header/page-header';
import { ReturnButton } from '../../@generic/components/return-button/return-button';
import { ThemeContext } from '../../theme/context/theme.context';
import { defaultScoringConfig } from '../scoring-config.interface';

import { ListItem } from './list-item';
import { ScoringScreenStyles as styles } from './scoring-screen.styles';

// eslint-disable-next-line max-lines-per-function
export const ScoringScreen = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const textStyle = { color: theme.colors.label.main };
    const headingStyle = { color: theme.colors.label.main, fontWeight: 'bold' as const, fontSize: 16, marginTop: 16, marginBottom: 8 };
    const codeStyle = { color: theme.colors.label.main, fontFamily: 'monospace', fontWeight: 'bold' as const };
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
                        {t`Each correct placement starts with a base value:`}{' '}
                        <Text style={codeStyle}>{defaultScoringConfig.correctValue}</Text>
                    </Text>
                    <Text style={textStyle}>{t`This value is multiplied by the difficulty coefficient:`}</Text>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Newbie</Trans>:{' '}
                        <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Newbie]}</Text> ={' '}
                        <Text style={codeStyle}>
                            {defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Newbie]}
                        </Text>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Easy</Trans>:{' '}
                        <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy]}</Text> ={' '}
                        <Text style={codeStyle}>
                            {defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy]}
                        </Text>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Medium</Trans>:{' '}
                        <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Medium]}</Text> ={' '}
                        <Text style={codeStyle}>
                            {defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Medium]}
                        </Text>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Hard</Trans>:{' '}
                        <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Hard]}</Text> ={' '}
                        <Text style={codeStyle}>
                            {defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Hard]}
                        </Text>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Nightmare</Trans>:{' '}
                        <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Nightmare]}</Text> ={' '}
                        <Text style={codeStyle}>
                            {defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Nightmare]}
                        </Text>
                    </ListItem>
                </View>

                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Max Mistakes bonus`}</Text>
                    <Text style={textStyle}>{t`Playing with fewer mistakes allowed gives you a score multiplier:`}</Text>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Immortal (99 mistakes)</Trans>:{' '}
                        <Text style={codeStyle}>
                            ×{defaultScoringConfig.maxMistakesCoefficients[99]}(<Trans>no bonus</Trans>)
                        </Text>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Standard (3 mistakes)</Trans>:{' '}
                        <Text style={codeStyle}>×{defaultScoringConfig.maxMistakesCoefficients[3]}</Text>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Hardcore (0 mistakes)</Trans>:{' '}
                        <Text style={codeStyle}>×{defaultScoringConfig.maxMistakesCoefficients[0]}</Text>
                    </ListItem>
                </View>

                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Completion Bonuses`}</Text>
                    <Text style={textStyle}>{t`Extra points are awarded when your placement completes:`}</Text>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Row</Trans>: <Text style={codeStyle}>×{defaultScoringConfig.lastInRowCoefficientConstant}</Text>{' '}
                        <Trans>of current score</Trans>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Column</Trans>: <Text style={codeStyle}>×{defaultScoringConfig.lastInColCoefficientConstant}</Text>{' '}
                        <Trans>of current score</Trans>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Group(3x3 cells)</Trans>:{' '}
                        <Text style={codeStyle}>×{defaultScoringConfig.lastInGroupCoefficientConstant}</Text>{' '}
                        <Trans>of current score</Trans>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>All of a number (1-9)</Trans>: <Text style={codeStyle}>×{defaultScoringConfig.lastValueCoefficient}</Text>{' '}
                        <Trans>of current score</Trans>
                    </ListItem>
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
                    <Text style={headingStyle}>{t`Tips for High Scores`}</Text>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Play on higher difficulties for bigger multipliers</Trans>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Complete rows, columns, and blocks for huge bonuses</Trans>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Be fast to minimize time penalties</Trans>
                    </ListItem>
                    <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                        • <Trans>Avoid mistakes - they cost you points!</Trans>
                    </ListItem>
                </View>
            </ScrollView>

            <ReturnButton />
        </View>
    );
};
