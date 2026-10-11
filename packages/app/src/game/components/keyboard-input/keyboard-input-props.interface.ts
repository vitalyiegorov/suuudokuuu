import type { TextInputProps } from 'react-native';

export interface KeyboardInputPropsInterface {
    readonly onKeyPress: NonNullable<TextInputProps['onKeyPress']>;
}
