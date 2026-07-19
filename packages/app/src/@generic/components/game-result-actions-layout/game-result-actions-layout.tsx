import { type ReactNode, use } from 'react';
import { View } from 'react-native';

import { ThemeContext } from '../../../theme/context/theme.context';

import { GameResultActionsLayoutStyles as styles } from './game-result-actions-layout.styles';

interface Props {
    readonly children: ReactNode;
}

export const GameResultActionsLayout = ({ children }: Props): ReactNode => {
    const { theme } = use(ThemeContext);
    const actionBandStyles = [styles.actions, { backgroundColor: theme.colors.background }];

    return <View style={actionBandStyles}>{children}</View>;
};
