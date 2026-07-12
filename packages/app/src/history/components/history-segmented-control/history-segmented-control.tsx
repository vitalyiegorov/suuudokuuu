import { t } from '@lingui/core/macro';
import { use } from 'react';
import { Pressable, View } from 'react-native';

import { BlackText } from '../../../@generic/components/black-text/black-text';
import {
    HistoryScreenGamesTab,
    HistoryScreenStatsTab
} from '../../../screens/components/history-screen/constant/history-screen-tab.constant';
import { ThemeContext } from '../../../theme/context/theme.context';

import { HistorySegmentedControlSelectors } from './history-segmented-control.selectors';
import { HistorySegmentedControlStyles as styles } from './history-segmented-control.styles';

import type { HistoryScreenTab } from '../../../screens/components/history-screen/constant/history-screen-tab.constant';

interface Props {
    readonly selectedTab: HistoryScreenTab;
    readonly onSelectTab: (tab: HistoryScreenTab) => void;
}

export const HistorySegmentedControl = ({ selectedTab, onSelectTab }: Props) => {
    const { theme } = use(ThemeContext);
    const containerStyles = [styles.container, { backgroundColor: theme.colors.candidate.bg, borderColor: theme.colors.candidate.border }];
    const tabs = [
        { label: t`Overview`, testID: HistorySegmentedControlSelectors.OverviewTab, value: HistoryScreenStatsTab },
        { label: t`Games`, testID: HistorySegmentedControlSelectors.GamesTab, value: HistoryScreenGamesTab }
    ] as const;

    return (
        <View style={containerStyles}>
            {tabs.map(tab => {
                const isSelected = selectedTab === tab.value;
                const tabStyles = [styles.tab, { backgroundColor: isSelected ? theme.colors.black : 'transparent' }];
                const labelStyles = [styles.label, { color: isSelected ? theme.colors.label.inverted : theme.colors.label.hint }];
                const handlePress = () => {
                    onSelectTab(tab.value);
                };

                return (
                    <Pressable accessibilityRole="button" key={tab.value} onPress={handlePress} style={tabStyles} testID={tab.testID}>
                        <BlackText style={labelStyles}>{tab.label}</BlackText>
                    </Pressable>
                );
            })}
        </View>
    );
};
