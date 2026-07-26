import { useLingui } from '@lingui/react/macro';
import { Tabs } from 'expo-router';
import { BarChart3, Play, Settings } from 'lucide-react-native';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { MainTabIcon } from '../main-tab-icon/main-tab-icon';

import type { ColorValue } from 'react-native';

const MainTabLayoutActivePillRadius = 18;

interface TabBarIconInput {
    readonly color: ColorValue;
    readonly size: number;
}

export const MainTabLayout = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const tabBarStyle = {
        backgroundColor: theme.colors.background,
        borderTopColor: theme.colors.candidate.border
    };
    const tabBarItemStyle = {
        borderRadius: MainTabLayoutActivePillRadius,
        marginHorizontal: 8,
        marginVertical: 0
    };
    const screenOptions = {
        headerShown: false,
        tabBarActiveBackgroundColor: theme.colors.surface.subtle,
        tabBarActiveTintColor: theme.colors.label.main,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: theme.colors.label.hint,
        tabBarItemStyle,
        tabBarStyle
    };
    const playLabel = t`Play`;
    const statsLabel = t`Stats`;
    const settingsLabel = t`Settings`;
    const playOptions = {
        tabBarIcon: (props: TabBarIconInput) => <MainTabIcon Icon={Play} color={props.color} size={props.size} />,
        tabBarLabel: playLabel,
        title: playLabel
    };
    const statsOptions = {
        tabBarIcon: (props: TabBarIconInput) => <MainTabIcon Icon={BarChart3} color={props.color} size={props.size} />,
        tabBarLabel: statsLabel,
        title: statsLabel
    };
    const settingsOptions = {
        tabBarIcon: (props: TabBarIconInput) => <MainTabIcon Icon={Settings} color={props.color} size={props.size} />,
        tabBarLabel: settingsLabel,
        title: settingsLabel
    };

    return (
        <Tabs backBehavior="none" screenOptions={screenOptions}>
            <Tabs.Screen name="index" options={playOptions} />
            <Tabs.Screen name="history" options={statsOptions} />
            <Tabs.Screen name="settings" options={settingsOptions} />
        </Tabs>
    );
};
