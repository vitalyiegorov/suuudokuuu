import { Pressable } from 'react-native';

import { BlackText } from '../../../../@generic/components/black-text/black-text';

import type { HomeScreenOptionCardInterface } from '../interface/home-screen-option-card.interface';

interface Props {
    readonly option: HomeScreenOptionCardInterface;
}

export const HomeScreenOptionCard = ({ option }: Props) => (
    <Pressable onPress={option.onPress} style={option.cardStyles}>
        <BlackText numberOfLines={1} style={option.titleStyles}>
            {option.title}
        </BlackText>
        <BlackText numberOfLines={1} style={option.descriptionStyles}>
            {option.description}
        </BlackText>
    </Pressable>
);
