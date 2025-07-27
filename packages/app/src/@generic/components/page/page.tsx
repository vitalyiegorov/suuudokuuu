import { use } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemeContext } from '../../context/theme.context';

import type { ComponentProps } from 'react';

export const Page = (props: ComponentProps<typeof SafeAreaView>) => {
    const { theme } = use(ThemeContext);

    const style = [{ flex: 1 }, { backgroundColor: theme.colors.background }];

    return <SafeAreaView style={style} {...props} />;
};
