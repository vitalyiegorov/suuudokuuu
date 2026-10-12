import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native';
import { withUnistyles } from 'react-native-unistyles';

import type { UnistylesThemeInterface } from '../../../theme/interface/unistyles-theme.interface';
import type { ComponentType } from 'react';

interface Props extends ActivityIndicatorProps {
    readonly uniProps: (theme: UnistylesThemeInterface) => { readonly color: string };
}

export const AppButtonLoader: ComponentType<Props> = withUnistyles(ActivityIndicator);
