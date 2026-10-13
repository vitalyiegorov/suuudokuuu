import { withUnistyles } from 'react-native-unistyles';

import type { UnistylesThemeInterface } from '../../../theme/interface/unistyles-theme.interface';
import type { LucideIcon } from 'lucide-react-native';
import type { ComponentType } from 'react';

interface Props {
    readonly icon: LucideIcon;
    readonly color?: string;
    readonly uniProps: (theme: UnistylesThemeInterface) => { readonly color: string };
}

export const AppButtonIcon: ComponentType<Props> = withUnistyles(({ icon: Icon, color }: Props) => <Icon color={color} size={18} />);
