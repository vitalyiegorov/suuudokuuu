import { differenceInSeconds, format, setMinutes, setSeconds } from 'date-fns';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { ElapsedTimeStyles as styles } from './elapsed-time.styles';

const getElapsedTime = (start: Date) => (end: Date) => {
    const currentTime = new Date();

    const remainingSeconds = differenceInSeconds(end, start);
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return format(setMinutes(setSeconds(currentTime, seconds), minutes), 'mm:ss');
};

interface Props {
    startedAt: Date;
}

export const ElapsedTime = ({ startedAt }: Props) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const elapsedFormatted = getElapsedTime(startedAt);

    useEffect(() => {
        const handle = setInterval(() => setCurrentTime(new Date()), 1000);

        return () => clearTimeout(handle);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>({elapsedFormatted(currentTime)})</Text>
        </View>
    );
};
