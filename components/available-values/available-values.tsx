import { View } from 'react-native';
import { useSelector } from 'react-redux';

import { appRootAvailableValuesSelector } from '../../store/app-root/app-root.selectors';
import { AvailableValuesItem } from '../available-values-item/available-values-item';

import { AvailableValuesStyles as styles } from './available-values.styles';

export const AvailableValues = () => {
    const allValues = useSelector(appRootAvailableValuesSelector);
    const availableValues = Object.keys(allValues)
        .filter(key => allValues[Number(key)] < 9)
        .map(Number);

    return (
        <View style={styles.wrapper}>
            {availableValues.map(value => (
                <AvailableValuesItem value={value} key={value} />
            ))}
        </View>
    );
};
