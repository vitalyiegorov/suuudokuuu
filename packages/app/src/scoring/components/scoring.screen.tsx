import { Plural, Trans, useLingui } from '@lingui/react/macro';
import { DifficultyEnum } from '@suuudokuuu/generator';
import { resolveUnistyleForAnimated } from '@suuudokuuu/ui';
import { use } from 'react';
import { Text, View } from 'react-native';

import { CollapsibleChromePage } from '../../@generic/components/collapsible-chrome-page/collapsible-chrome-page';
import { ThemeContext } from '../../theme/context/theme.context';
import { defaultScoringConfig } from '../interfaces/scoring-config.interface';

import { ListItem } from './list-item';
import { ScoringScreenSelectors } from './scoring-screen.selectors';
import { ScoringScreenStyles as styles } from './scoring-screen.styles';

// eslint-disable-next-line max-lines-per-function
export const ScoringScreen = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);

    const textStyle = { color: theme.colors.text.primary };
    const headingStyle = { color: theme.colors.text.primary, fontWeight: 'bold' as const, fontSize: 16, marginTop: 16, marginBottom: 8 };
    const codeStyle = { color: theme.colors.text.primary, fontFamily: 'monospace', fontWeight: 'bold' as const };

    return (
        <CollapsibleChromePage
            contentContainerStyle={resolveUnistyleForAnimated(styles.scrollViewContent)}
            contentStyle={styles.content}
            style={resolveUnistyleForAnimated(styles.scrollView)}
            testID={ScoringScreenSelectors.Root}
            title={t`How Scoring Works`}
        >
            <View style={styles.section}>
                <Text style={textStyle}>
                    <Trans>Score is calculated for each correct cell placement based on difficulty, bonuses, and penalties.</Trans>
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={headingStyle}>
                    <Trans>Base Score</Trans>
                </Text>
                <Text style={textStyle}>
                    <Trans>Each correct placement starts with a base value:</Trans>{' '}
                    <Text style={codeStyle}>{defaultScoringConfig.correctValue}</Text>
                </Text>
                <Text style={textStyle}>
                    <Trans>This value is multiplied by the difficulty coefficient:</Trans>
                </Text>
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
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Hell</Trans>:{' '}
                    <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Hell]}</Text> ={' '}
                    <Text style={codeStyle}>
                        {defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Hell]}
                    </Text>
                </ListItem>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Infinity</Trans>:{' '}
                    <Text style={codeStyle}>×{defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Infinity]}</Text> ={' '}
                    <Text style={codeStyle}>
                        {defaultScoringConfig.correctValue * defaultScoringConfig.difficultyCoefficients[DifficultyEnum.Infinity]}
                    </Text>
                </ListItem>
            </View>

            <View style={styles.section}>
                <Text style={headingStyle}>
                    <Trans>Max Mistakes bonus</Trans>
                </Text>
                <Text style={textStyle}>
                    <Trans>Playing with fewer mistakes allowed gives you a score multiplier:</Trans>
                </Text>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Immortal</Trans> (<Plural value={99} one="# mistake" other="# mistakes" />
                    ):{' '}
                    <Text style={codeStyle}>
                        ×{defaultScoringConfig.maxMistakesCoefficients[99]}(<Trans>no bonus</Trans>)
                    </Text>
                </ListItem>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Standard</Trans> (<Plural value={3} one="# mistake" other="# mistakes" />
                    ): <Text style={codeStyle}>×{defaultScoringConfig.maxMistakesCoefficients[3]}</Text>
                </ListItem>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Hardcore</Trans> (<Plural value={0} one="# mistake" other="# mistakes" />
                    ): <Text style={codeStyle}>×{defaultScoringConfig.maxMistakesCoefficients[0]}</Text>
                </ListItem>
            </View>

            <View style={styles.section}>
                <Text style={headingStyle}>
                    <Trans>Completion Bonuses</Trans>
                </Text>
                <Text style={textStyle}>
                    <Trans>Extra points are awarded when your placement completes:</Trans>
                </Text>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Row</Trans>: <Text style={codeStyle}>×{defaultScoringConfig.lastInRowCoefficientConstant}</Text>{' '}
                    <Trans>of current score</Trans>
                </ListItem>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Column</Trans>: <Text style={codeStyle}>×{defaultScoringConfig.lastInColCoefficientConstant}</Text>{' '}
                    <Trans>of current score</Trans>
                </ListItem>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Group(3x3 cells)</Trans>: <Text style={codeStyle}>×{defaultScoringConfig.lastInGroupCoefficientConstant}</Text>{' '}
                    <Trans>of current score</Trans>
                </ListItem>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>All of a number (1-9)</Trans>: <Text style={codeStyle}>×{defaultScoringConfig.lastValueCoefficient}</Text>{' '}
                    <Trans>of current score</Trans>
                </ListItem>
            </View>

            <View style={styles.section}>
                <Text style={headingStyle}>
                    <Trans>Penalties</Trans>
                </Text>
                <Text style={textStyle}>
                    <Trans>Points are deducted for:</Trans>
                </Text>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Time</Trans>: <Text style={codeStyle}>{defaultScoringConfig.elapsedCoefficient}</Text>{' '}
                    <Trans>per second</Trans>
                </ListItem>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Mistakes</Trans>: <Text style={codeStyle}>{defaultScoringConfig.mistakesCoefficient}</Text>{' '}
                    <Trans>per mistake</Trans>
                </ListItem>
                <Text style={textStyle}>
                    <Trans>Penalty formula</Trans>:{' '}
                    <Text style={codeStyle}>
                        <Trans>score × coefficient × count</Trans>
                    </Text>
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={headingStyle}>
                    <Trans>Assists</Trans>
                </Text>
                <Text style={textStyle}>
                    <Trans>An assist is charged once, as a fraction of one plain placement at your difficulty and mistake limit:</Trans>
                </Text>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Applying a hint</Trans>: <Text style={codeStyle}>×{defaultScoringConfig.hintCoefficient}</Text>{' '}
                    <Trans>of one placement</Trans>
                </ListItem>
                <ListItem listItemStyle={styles.listItem} textStyle={textStyle}>
                    • <Trans>Undoing a placement</Trans>: <Text style={codeStyle}>×{defaultScoringConfig.undoCoefficient}</Text>{' '}
                    <Trans>of one placement</Trans>
                </ListItem>
                <Text style={textStyle}>
                    <Trans>
                        Undo also returns the points that the undone placement earned, so replaying the same cell can never earn them twice.
                        Dismissing a hint without applying it costs nothing, and undoing a pencil mark is always free.
                    </Trans>
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={headingStyle}>
                    <Trans>Minimum Score</Trans>
                </Text>
                <Text style={textStyle}>
                    <Trans>No matter how many penalties, you always earn at least</Trans>{' '}
                    <Text style={codeStyle}>{defaultScoringConfig.correctMinValue}</Text> <Trans>points per correct placement.</Trans>
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={headingStyle}>
                    <Trans>Tips for High Scores</Trans>
                </Text>
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
        </CollapsibleChromePage>
    );
};
