import { useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { ComponentProps } from 'react';

const styles = { flex: 1 };
const darkModeStyles = { backgroundColor: '#000' };

export const Page = (props: ComponentProps<typeof SafeAreaView>) => (
    <SafeAreaView
        style={[styles, ...(useColorScheme() === 'dark' ? [darkModeStyles] : [])]}
        {...props}
    />
);
