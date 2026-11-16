import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { ConnectedComponentInterface } from '../interfaces/connected-component.interface';

const findRoot = (parents: number[], label: number): number => {
    let root = label;

    while (parents[root] !== root) {
        parents[root] = parents[parents[root]];
        root = parents[root];
    }

    return root;
};

const joinLabels = (parents: number[], label: number, neighbor: number): number => {
    if (neighbor === 0 || neighbor === label) {
        return label;
    }

    const neighborRoot = findRoot(parents, neighbor);
    const root = label === 0 ? neighborRoot : findRoot(parents, label);

    parents[Math.max(root, neighborRoot)] = Math.min(root, neighborRoot);

    return Math.min(root, neighborRoot);
};

const labelInk = ({ width, data }: BinaryImageInterface, labels: Int32Array): number[] => {
    const parents = [0];

    for (let index = 0; index < data.length; index += 1) {
        if (data[index] === 1) {
            const column = index % width;
            const hasRowAbove = index >= width;
            const west = joinLabels(parents, 0, column > 0 ? labels[index - 1] : 0);
            const northWest = joinLabels(parents, west, hasRowAbove && column > 0 ? labels[index - width - 1] : 0);
            const north = joinLabels(parents, northWest, hasRowAbove ? labels[index - width] : 0);
            const label = joinLabels(parents, north, hasRowAbove && column < width - 1 ? labels[index - width + 1] : 0);

            labels[index] = label === 0 ? parents.push(parents.length) - 1 : label;
        }
    }

    return parents;
};

export const labelComponents = (mask: BinaryImageInterface) => {
    const labels = new Int32Array(mask.width * mask.height);
    const parents = labelInk(mask, labels);
    const componentByRoot = new Int32Array(parents.length);
    const components: { -readonly [Key in keyof ConnectedComponentInterface]: number }[] = [];

    for (let index = 0; index < labels.length; index += 1) {
        if (labels[index] !== 0) {
            const root = findRoot(parents, labels[index]);
            const x = index % mask.width;
            const y = (index - x) / mask.width;

            if (componentByRoot[root] === 0) {
                componentByRoot[root] = components.push({ label: components.length + 1, area: 0, minX: x, maxX: x, minY: y, maxY: y });
            }

            const component = components[componentByRoot[root] - 1];

            component.area += 1;
            component.minX = x < component.minX ? x : component.minX;
            component.maxX = x > component.maxX ? x : component.maxX;
            component.maxY = y;
            labels[index] = component.label;
        }
    }

    return { labels, components };
};
