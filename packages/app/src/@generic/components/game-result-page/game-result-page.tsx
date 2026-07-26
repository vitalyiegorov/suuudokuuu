import { View } from 'react-native';

import { ChromeScrollPage } from '../chrome-scroll-page/chrome-scroll-page';

import { GameResultPageStyles as styles } from './game-result-page.styles';

import type { ReactNode } from 'react';

interface Props {
    readonly children: ReactNode;
    readonly footer: ReactNode;
    readonly testID: string;
}

export const GameResultPage = ({ children, footer, testID }: Props): ReactNode => (
    <ChromeScrollPage footer={footer} testID={testID}>
        <View style={styles.content}>{children}</View>
    </ChromeScrollPage>
);
