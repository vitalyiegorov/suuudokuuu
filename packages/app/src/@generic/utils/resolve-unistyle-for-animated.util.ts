import { Platform } from 'react-native';

export const resolveUnistyleForAnimated = <StyleType extends object>(style: StyleType): Partial<StyleType> => {
    if (Platform.OS !== 'web') {
        return style;
    }

    return Object.getOwnPropertyNames(style).reduce<Partial<StyleType>>((resolvedStyle, propertyName) => {
        if (propertyName.startsWith('unistyles_')) {
            return resolvedStyle;
        }

        return { ...resolvedStyle, [propertyName]: Reflect.get(style, propertyName) };
    }, {});
};
