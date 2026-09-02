import { MaxFontSizeMultiplierConstant } from '@suuudokuuu/ui/theme';
import { FC, use } from 'react';
import { Platform, Text, View } from 'react-native';

import { isDefined } from '@rnw-community/shared';

import { ThemeContext } from '../../../theme/context/theme.context';

import { BlackTextStyles } from './black-text.styles';

import type { LucideProps } from 'lucide-react-native';
import type { TextProps } from 'react-native';

interface Props extends TextProps {
    icon?: FC<LucideProps>;
}

export const BlackText = ({ style, icon: Icon, ...props }: Props) => {
    const { theme } = use(ThemeContext);

    const textStyles = [
        BlackTextStyles.text,
        {
            color: theme.colors.text.primary,
            ...(isDefined(Icon) && Platform.select({ web: { flexBasis: 0 } }))
        },
        style
    ];

    if (isDefined(Icon)) {
        const iconStyles = [{ color: theme.colors.text.primary, marginLeft: 4 }];

        return (
            <View style={BlackTextStyles.container}>
                <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={textStyles} {...props} />
                <Icon style={iconStyles} width={10} height={10} />
            </View>
        );
    }

    return <Text maxFontSizeMultiplier={MaxFontSizeMultiplierConstant} style={textStyles} {...props} />;
};
