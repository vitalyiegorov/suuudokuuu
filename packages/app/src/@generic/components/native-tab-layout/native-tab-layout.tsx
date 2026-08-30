import { useLingui } from '@lingui/react/macro';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';
import { TabBarInsetContext } from '../main-tab-layout/context/tab-bar-inset.context';

import { NativeTabBarOccupiedHeight } from './constant/native-tab-layout.constant';

const PlayIcon = { default: 'play', selected: 'play.fill' } as const;
const DailyIcon = { default: 'calendar', selected: 'calendar.circle.fill' } as const;
const StatsIcon = { default: 'chart.bar', selected: 'chart.bar.fill' } as const;
const SettingsIcon = { default: 'gearshape', selected: 'gearshape.fill' } as const;

export const NativeTabLayout = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const labelStyle = { color: theme.colors.text.hint };

    return (
        <TabBarInsetContext value={NativeTabBarOccupiedHeight}>
            <NativeTabs
                backgroundColor={theme.colors.background}
                blurEffect="systemChromeMaterial"
                disableTransparentOnScrollEdge
                iconColor={theme.colors.text.hint}
                labelStyle={labelStyle}
                minimizeBehavior="onScrollDown"
                tintColor={theme.colors.text.primary}
            >
                <NativeTabs.Trigger name="index">
                    <NativeTabs.Trigger.Label>{t`Play`}</NativeTabs.Trigger.Label>
                    <NativeTabs.Trigger.Icon md="play_arrow" sf={PlayIcon} />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="daily">
                    <NativeTabs.Trigger.Label>{t`Daily`}</NativeTabs.Trigger.Label>
                    <NativeTabs.Trigger.Icon md="event" sf={DailyIcon} />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="history">
                    <NativeTabs.Trigger.Label>{t`Stats`}</NativeTabs.Trigger.Label>
                    <NativeTabs.Trigger.Icon md="bar_chart" sf={StatsIcon} />
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name="settings">
                    <NativeTabs.Trigger.Label>{t`Settings`}</NativeTabs.Trigger.Label>
                    <NativeTabs.Trigger.Icon md="settings" sf={SettingsIcon} />
                </NativeTabs.Trigger>
            </NativeTabs>
        </TabBarInsetContext>
    );
};
