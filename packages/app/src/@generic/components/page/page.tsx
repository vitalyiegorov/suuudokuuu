import { use } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeContext } from '../../../theme/context/theme.context';

import { PageSafeAreaEdges } from './constant/page-safe-area-edges.constant';

import type { ComponentProps } from 'react';

export const Page = (props: ComponentProps<typeof SafeAreaView>) => {
    const { edges = PageSafeAreaEdges, style, ...restProps } = props;
    const { theme } = use(ThemeContext);

    const containerStyle = [{ flex: 1 }, { backgroundColor: theme.colors.background }, style];

    return <SafeAreaView edges={edges} style={containerStyle} {...restProps} />;
};
