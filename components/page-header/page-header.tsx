import { isNotEmptyString } from '@rnw-community/shared';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { PageTitleConstant } from '../../constants/text.constants';

interface Props {
    title?: string;
}

export const PageHeader = ({ title = '' }: Props) => {
    const fullTitle = isNotEmptyString(title) ? `${PageTitleConstant} - ${title}` : PageTitleConstant;

    return (
        <>
            <StatusBar style="auto" />
            <Stack.Screen options={{ title: fullTitle }} />
        </>
    );
};
