import { isEmptyArray, isNotEmptyString } from '@rnw-community/shared';

const BACKDROP_FILTER_PROPERTY = 'backdrop-filter';
const WEBKIT_BACKDROP_FILTER_PROPERTY = '-webkit-backdrop-filter';
const DISABLED_VALUE = 'none';

const isHtmlElement = (element: Element): element is HTMLElement => element instanceof HTMLElement;

const hasBackdropFilter = (element: HTMLElement): boolean => {
    const computedStyle = window.getComputedStyle(element);
    const standardValue = computedStyle.getPropertyValue(BACKDROP_FILTER_PROPERTY);
    const webkitValue = computedStyle.getPropertyValue(WEBKIT_BACKDROP_FILTER_PROPERTY);
    const appliedValue = isNotEmptyString(standardValue) ? standardValue : webkitValue;

    return isNotEmptyString(appliedValue) && appliedValue !== DISABLED_VALUE;
};

const restoreProperty = (element: HTMLElement, property: string, previousValue: string): void => {
    if (isNotEmptyString(previousValue)) {
        element.style.setProperty(property, previousValue);
    } else {
        element.style.removeProperty(property);
    }
};

const disableBackdropFilter = (element: HTMLElement): (() => void) => {
    const previousStandardValue = element.style.getPropertyValue(BACKDROP_FILTER_PROPERTY);
    const previousWebkitValue = element.style.getPropertyValue(WEBKIT_BACKDROP_FILTER_PROPERTY);

    element.style.setProperty(BACKDROP_FILTER_PROPERTY, DISABLED_VALUE);
    element.style.setProperty(WEBKIT_BACKDROP_FILTER_PROPERTY, DISABLED_VALUE);

    return () => {
        restoreProperty(element, BACKDROP_FILTER_PROPERTY, previousStandardValue);
        restoreProperty(element, WEBKIT_BACKDROP_FILTER_PROPERTY, previousWebkitValue);
    };
};

export const recompositeBackdropLayers = (container: HTMLElement): void => {
    const blurredElements = [container, ...container.querySelectorAll('*')].filter(isHtmlElement).filter(hasBackdropFilter);

    if (isEmptyArray(blurredElements)) {
        return;
    }

    const restoreCallbacks = blurredElements.map(disableBackdropFilter);

    window.requestAnimationFrame(() => void restoreCallbacks.forEach(restore => void restore()));
};
