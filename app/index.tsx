import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';

import { AvailableValues } from '../components/available-values/available-values';
import { Field } from '../components/field/field';
import { createStore } from '../store/create-store';

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default function Game() {
    return (
        <Provider store={createStore}>
            <View style={styles.container}>
                <StatusBar style="auto" />
                <Field />
                <AvailableValues />
            </View>
        </Provider>
    );
}
