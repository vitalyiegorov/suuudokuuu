import type { Page } from '@playwright/test';

declare global {
    interface Window {
        backdropFilterChanges: string[];
    }
}

export const watchBackdropFilterChanges = async (page: Page): Promise<number> =>
    page.evaluate(() => {
        window.backdropFilterChanges = [];

        const blurredElements = [...document.querySelectorAll('#root *')].filter(element => {
            const computedStyle = getComputedStyle(element);
            const standardValue = computedStyle.getPropertyValue('backdrop-filter');
            const webkitValue = computedStyle.getPropertyValue('-webkit-backdrop-filter');
            const appliedValue = standardValue === '' ? webkitValue : standardValue;

            return appliedValue !== '' && appliedValue !== 'none';
        });

        blurredElements.forEach((element, index) => {
            const observer = new MutationObserver(() => {
                const computedStyle = getComputedStyle(element);
                const standardValue = computedStyle.getPropertyValue('backdrop-filter');
                const webkitValue = computedStyle.getPropertyValue('-webkit-backdrop-filter');
                const appliedValue = standardValue === '' ? webkitValue : standardValue;

                window.backdropFilterChanges.push(`${index}:${appliedValue === 'none' ? 'cleared' : 'restored'}`);
            });

            observer.observe(element, { attributes: true, attributeFilter: ['style'] });
        });

        return blurredElements.length;
    });
