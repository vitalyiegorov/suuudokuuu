import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';

import { Field } from './components/field/field';
import { createStore } from './store/create-store';

export default function App() {
    return (
        <Provider store={createStore}>
            <View style={styles.container}>
                <Text>Open up App.js to start working on your app!</Text>
                <StatusBar style="auto" />
                <Field />
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center'
    }
});
