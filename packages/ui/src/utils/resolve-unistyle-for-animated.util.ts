export const resolveUnistyleForAnimated = <StyleType extends object>(style: StyleType): Partial<StyleType> => {
    const resolvedStyle: Partial<StyleType> = {};

    for (const [propertyName, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(style))) {
        if (!propertyName.startsWith('unistyles_')) {
            Reflect.set(resolvedStyle, propertyName, typeof descriptor.get === 'function' ? descriptor.get.call(style) : descriptor.value);
        }
    }

    return resolvedStyle;
};
