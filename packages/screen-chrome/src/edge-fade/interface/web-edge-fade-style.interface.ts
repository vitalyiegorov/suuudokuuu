import { ViewStyle } from 'react-native';

export interface WebEdgeFadeStyleInterface extends ViewStyle {
    readonly backdropFilter?: string;
    readonly WebkitBackdropFilter?: string;
    readonly maskImage?: string;
    readonly WebkitMaskImage?: string;
    readonly backgroundImage?: string;
}
