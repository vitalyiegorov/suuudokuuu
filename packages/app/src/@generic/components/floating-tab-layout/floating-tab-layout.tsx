import { useLingui } from '@lingui/react/macro';
import { Tabs } from 'expo-router';
import CalendarDays from 'lucide-react-native/icons/calendar-days';
import BarChart3 from 'lucide-react-native/icons/chart-column';
import Play from 'lucide-react-native/icons/play';
import Settings from 'lucide-react-native/icons/settings';

import { FloatingTabBarOccupiedHeight } from '../floating-tab-bar/constant/floating-tab-bar.constant';
import { FloatingTabBar } from '../floating-tab-bar/floating-tab-bar';
import { MainTabIcon } from '../main-tab-icon/main-tab-icon';
import { TabBarInsetContext } from '../main-tab-layout/context/tab-bar-inset.context';

import type { BottomTabBarProps } from 'expo-router/tabs';
import type { ColorValue } from 'react-native';

interface TabBarIconInput {
    readonly color: ColorValue;
    readonly size: number;
}

const screenOptions = { headerShown: false, tabBarHideOnKeyboard: true };
const renderTabBar = (props: BottomTabBarProps) => <FloatingTabBar {...props} />;

export const FloatingTabLayout = () => {
    const { t } = useLingui();

    const playOptions = {
        tabBarIcon: (props: TabBarIconInput) => <MainTabIcon Icon={Play} color={props.color} size={props.size} />,
        title: t`Play`
    };
    const dailyOptions = {
        tabBarIcon: (props: TabBarIconInput) => <MainTabIcon Icon={CalendarDays} color={props.color} size={props.size} />,
        title: t`Daily`
    };
    const statsOptions = {
        tabBarIcon: (props: TabBarIconInput) => <MainTabIcon Icon={BarChart3} color={props.color} size={props.size} />,
        title: t`Stats`
    };
    const settingsOptions = {
        tabBarIcon: (props: TabBarIconInput) => <MainTabIcon Icon={Settings} color={props.color} size={props.size} />,
        title: t`Settings`
    };

    return (
        <TabBarInsetContext value={FloatingTabBarOccupiedHeight}>
            <Tabs backBehavior="none" screenOptions={screenOptions} tabBar={renderTabBar}>
                <Tabs.Screen name="index" options={playOptions} />
                <Tabs.Screen name="daily" options={dailyOptions} />
                <Tabs.Screen name="history" options={statsOptions} />
                <Tabs.Screen name="settings" options={settingsOptions} />
            </Tabs>
        </TabBarInsetContext>
    );
};
