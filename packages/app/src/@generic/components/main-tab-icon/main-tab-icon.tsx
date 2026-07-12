import type { ComponentType } from 'react';
import type { ColorValue } from 'react-native';

interface LucideIconInput {
    readonly color?: string;
    readonly size?: number;
}

interface Props {
    readonly color: ColorValue;
    readonly Icon: ComponentType<LucideIconInput>;
    readonly size: number;
}

export const MainTabIcon = ({ color, Icon, size }: Props) => <Icon color={String(color)} size={size} />;
