import { cs } from '@rnw-community/shared';
import { Pressable, Text } from 'react-native';

import { useAppDispatch } from '../../hooks/redux.hook';
import { appRootSelectValueAction } from '../../store/app-root/actions/app-root-select-value.action';

import { AvailableValuesItemStyles as styles } from './available-values-item.styles';

interface Props {
    value: number;
}

export const AvailableValuesItem = ({ value }: Props) => {
    const dispatch = useAppDispatch();

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
