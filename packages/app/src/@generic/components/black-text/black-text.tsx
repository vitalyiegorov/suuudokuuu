import { LucideProps } from 'lucide-react-native';
import { FC, use } from 'react';
import { Text, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';

import { BlackTextStyles } from './black-text.styles';

import type { TextProps } from 'react-native';

interface Props extends TextProps {
    icon?: FC<LucideProps>;
}

export const BlackText = ({ style, icon: Icon, ...props }: Props) => {
    const { theme } = use(ThemeContext);

    const textStyles = [{ color: theme.colors.label.main }, style];
    const iconStyles = [{ color: theme.colors.label.main, marginLeft: 4 }];

    return (
        <View style={BlackTextStyles.container}>
            <Text allowFontScaling={false} style={textStyles} {...props} />
            {isDefined(Icon) && <Icon style={iconStyles} width={10} height={10} />}
        </View>
    );
};
