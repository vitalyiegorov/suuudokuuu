import { useLingui } from '@lingui/react/macro';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { use } from 'react';

import { ThemeContext } from '../../../theme/context/theme.context';

const PlayIcon = { default: 'play', selected: 'play.fill' } as const;
const StatsIcon = { default: 'chart.bar', selected: 'chart.bar.fill' } as const;
const SettingsIcon = { default: 'gearshape', selected: 'gearshape.fill' } as const;

export const NativeTabLayout = () => {
    const { t } = useLingui();
    const { theme } = use(ThemeContext);
    const labelStyle = { color: theme.colors.label.hint };

    return (
        <NativeTabs
            backgroundColor={theme.colors.background}
            blurEffect="systemChromeMaterial"
            disableTransparentOnScrollEdge
            iconColor={theme.colors.label.hint}
            labelStyle={labelStyle}
            minimizeBehavior="onScrollDown"
            tintColor={theme.colors.label.main}
        >
            <NativeTabs.Trigger name="index">
                <NativeTabs.Trigger.Label>{t`Play`}</NativeTabs.Trigger.Label>
                <NativeTabs.Trigger.Icon md="play_arrow" sf={PlayIcon} />
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
    );
};
