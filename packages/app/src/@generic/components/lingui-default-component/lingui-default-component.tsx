import { Text } from 'react-native';

import type { TransRenderProps } from '@lingui/react';

interface Props {
    readonly children: TransRenderProps['children'];
}

export const LinguiDefaultComponent = ({ children }: Props) => <Text>{children}</Text>;
