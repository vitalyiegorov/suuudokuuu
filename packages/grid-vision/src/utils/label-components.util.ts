import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { ComponentLabelingInterface } from '../interfaces/component-labeling.interface';
import type { ConnectedComponentInterface } from '../interfaces/connected-component.interface';

const fillComponent = (mask: BinaryImageInterface, labels: Int32Array, start: number, label: number): ConnectedComponentInterface => {
    const { width, height, data } = mask;
    const stack = [start];
    let area = 0;
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    labels[start] = label;

    while (stack.length > 0) {
        const index = stack.pop() ?? start;
        const x = index % width;
        const y = (index - x) / width;

        area += 1;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);

        for (let neighborY = Math.max(0, y - 1); neighborY <= Math.min(height - 1, y + 1); neighborY += 1) {
            for (let neighborX = Math.max(0, x - 1); neighborX <= Math.min(width - 1, x + 1); neighborX += 1) {
                const neighbor = neighborY * width + neighborX;

                if (data[neighbor] === 1 && labels[neighbor] === 0) {
                    labels[neighbor] = label;
                    stack.push(neighbor);
                }
            }
        }
    }

    return { label, area, minX, maxX, minY, maxY };
};

export const labelComponents = (mask: BinaryImageInterface): ComponentLabelingInterface => {
    const labels = new Int32Array(mask.width * mask.height);
    const components: ConnectedComponentInterface[] = [];

    for (let start = 0; start < mask.data.length; start += 1) {
        if (mask.data[start] === 1 && labels[start] === 0) {
            components.push(fillComponent(mask, labels, start, components.length + 1));
        }
    }

    return { labels, components };
};
