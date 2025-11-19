/* eslint-disable max-lines-per-function, @rnw-community/no-complex-jsx-logic */
import { useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { use } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Header } from '../../../@generic/components/header/header';
import { PageHeader } from '../../../@generic/components/page-header/page-header';
import { ReturnButton } from '../../../@generic/components/return-button/return-button';
import { defaultScoringConfig } from '../../../scoring/scoring-config.interface';
import { ThemeContext } from '../../../theme/context/theme.context';

import { ScoringScreenStyles as styles } from './scoring-screen.styles';

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
                {/* Introduction */}
                <View style={sectionStyle}>
                    <Text style={textStyle}>
                        {t`Score is calculated for each correct cell placement based on difficulty, bonuses, and penalties.`}
                    </Text>
                </View>

                {/* Base Score Section */}
                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Base Score`}</Text>
                    <Text style={textStyle}>
                        {t`Each correct placement starts with a base value:`} <Text style={codeStyle}>{defaultScoringConfig.correctValue}</Text>
                    </Text>
                    <Text style={textStyle}>{t`This value is multiplied by the difficulty coefficient:`}</Text>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`Newbie`}: <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Newbie]}</Text>{' '}
                            = <Text style={codeStyle}>{defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Newbie]}</Text>
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`Easy`}: <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy]}</Text> ={' '}
                            <Text style={codeStyle}>{defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Easy]}</Text>
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`Medium`}: <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Medium]}</Text>{' '}
                            = <Text style={codeStyle}>{defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Medium]}</Text>
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`Hard`}: <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Hard]}</Text> ={' '}
                            <Text style={codeStyle}>{defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Hard]}</Text>
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`Nightmare`}: <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Nightmare]}</Text>{' '}
                            = <Text style={codeStyle}>{defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Nightmare]}</Text>
                        </Text>
                    </View>
                </View>

                {/* Completion Bonuses */}
                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Completion Bonuses`}</Text>
                    <Text style={textStyle}>{t`Extra points are awarded when your placement completes:`}</Text>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`Row`}: <Text style={codeStyle}>×{defaultScoringConfig.lastInRowCoefficientConstant}</Text> {t`of current score`}
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`Column`}: <Text style={codeStyle}>×{defaultScoringConfig.lastInColCoefficientConstant}</Text> {t`of current score`}
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`3×3 Block`}: <Text style={codeStyle}>×{defaultScoringConfig.lastInGroupCoefficientConstant}</Text> {t`of current score`}
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`All of a number (1-9)`}: <Text style={codeStyle}>×{defaultScoringConfig.lastValueCoefficient}</Text>{' '}
                            {t`of current score`}
                        </Text>
                    </View>
                </View>

                {/* Penalties */}
                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Penalties`}</Text>
                    <Text style={textStyle}>{t`Points are deducted for:`}</Text>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`Time`}: <Text style={codeStyle}>{defaultScoringConfig.elapsedCoefficient}</Text> {t`per second`}
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            • {t`Mistakes`}: <Text style={codeStyle}>{defaultScoringConfig.mistakesCoefficient}</Text> {t`per mistake`}
                        </Text>
                    </View>
                    <Text style={textStyle}>
                        {t`Penalty formula`}: <Text style={codeStyle}>{t`score × coefficient × count`}</Text>
                    </Text>
                </View>

                {/* Minimum Score */}
                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Minimum Score`}</Text>
                    <Text style={textStyle}>
                        {t`No matter how many penalties, you always earn at least`}{' '}
                        <Text style={codeStyle}>{defaultScoringConfig.correctMinValue}</Text> {t`points per correct placement.`}
                    </Text>
                </View>

                {/* Example Calculation */}
                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Example`}</Text>
                    <Text style={textStyle}>{t`Easy difficulty, completing a row after 60 seconds with 2 mistakes:`}</Text>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            1. {t`Base`}: <Text style={codeStyle}>500 × 2 = 1,000</Text>
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            2. {t`Row bonus`}: <Text style={codeStyle}>1,000 × 3 = 3,000</Text>
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            3. {t`Subtotal`}: <Text style={codeStyle}>4,000</Text>
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            4. {t`Time penalty`}: <Text style={codeStyle}>4,000 × 60 × 0.001 = 240</Text>
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            5. {t`Mistake penalty`}: <Text style={codeStyle}>{t`3,760 × 2 × 0.05 = 376`}</Text>
                        </Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>
                            <Text style={{ fontWeight: 'bold' as const }}>{t`Final score`}:</Text>{' '}
                            <Text style={codeStyle}>{t`3,384 points`}</Text>
                        </Text>
                    </View>
                </View>

                {/* Tips */}
                <View style={sectionStyle}>
                    <Text style={headingStyle}>{t`Tips for High Scores`}</Text>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>• {t`Play on higher difficulties for bigger multipliers`}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>• {t`Complete rows, columns, and blocks for huge bonuses`}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>• {t`Be fast to minimize time penalties`}</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={textStyle}>• {t`Avoid mistakes - they cost you points!`}</Text>
                    </View>
                </View>
            </ScrollView>

            <ReturnButton />
        </View>
    );
};
