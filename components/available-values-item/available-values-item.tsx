import { cs } from '@rnw-community/shared';
import { Pressable, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { appRootSelectValueAction } from '../../store/app-root/app-root.actions';

import { AvailableValuesItemStyles as styles } from './available-values-item.styles';

interface Props {
    value: number;
}

export const AvailableValuesItem = ({ value }: Props) => {
    const dispatch = useDispatch();

    const isActive = false;

    const handlePress = () => void dispatch(appRootSelectValueAction(value));

    const wrapperStyles = [styles.wrapper, cs(isActive, styles.wrapperActive)];
    const textStyles = [styles.text, cs(isActive, styles.textActive)];

    return (
        <Pressable key={value} style={wrapperStyles} onPress={handlePress}>
            <Text style={textStyles}>{value}</Text>
        </Pressable>
    );
};
