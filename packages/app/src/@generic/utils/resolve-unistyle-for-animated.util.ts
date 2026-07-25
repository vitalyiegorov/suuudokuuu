export const resolveUnistyleForAnimated = <StyleType extends object>(style: StyleType): Partial<StyleType> =>
    Object.getOwnPropertyNames(style).reduce<Partial<StyleType>>((resolvedStyle, propertyName) => {
        if (propertyName.startsWith('unistyles_')) {
            return resolvedStyle;
        }

        return { ...resolvedStyle, [propertyName]: Reflect.get(style, propertyName) };
    }, {});
