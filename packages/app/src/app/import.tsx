import { useLocalSearchParams } from 'expo-router';

import { ImportScreen } from '../screens/components/import-screen/import.screen';

export default function ImportPage() {
    const { puzzle = '' } = useLocalSearchParams<{ puzzle?: string }>();

    return <ImportScreen initialText={puzzle} key={puzzle} />;
}
