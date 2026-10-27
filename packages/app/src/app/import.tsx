import { useLocalSearchParams } from 'expo-router';

import { isString } from '@rnw-community/shared';

import { ImportScreen } from '../screens/components/import-screen/import.screen';

export default function ImportPage() {
    const { puzzle } = useLocalSearchParams<{ puzzle?: string | string[] }>();
    const initialText = isString(puzzle) ? puzzle : (puzzle?.[0] ?? '');

    return <ImportScreen initialText={initialText} key={initialText} />;
}
