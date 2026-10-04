export const resolveUnistyleForAnimated = <StyleType extends object>(style: StyleType): Partial<StyleType> => {
    const resolvedStyle: Partial<StyleType> = {};

    for (const propertyName of Object.getOwnPropertyNames(style)) {
        if (!propertyName.startsWith('unistyles_')) {
            Reflect.set(resolvedStyle, propertyName, Reflect.get(style, propertyName));
        }
    }

    return resolvedStyle;
};
