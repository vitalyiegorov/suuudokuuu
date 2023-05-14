import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';

import { AvailableValues } from './components/available-values/available-values';
import { Field } from './components/field/field';
import { createStore } from './store/create-store';

// TODO: Extract to AppRoot
export default function App() {
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

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
