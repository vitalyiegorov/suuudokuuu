import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { isNotEmptyString } from '@rnw-community/shared';

import { PageTitleConstant } from '../../constants/text.constants';

interface Props {
    title?: string;
}

export const PageHeader = ({ title = '' }: Props) => {
    const fullTitle = isNotEmptyString(title) ? `${PageTitleConstant} - ${title}` : PageTitleConstant;

    return (
        <>
            {/* eslint-disable-next-line react/style-prop-object */}
            <StatusBar style="auto" />
            <Stack.Screen options={{ title: fullTitle }} />
        </>
    );
};
