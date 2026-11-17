import { labelComponents } from './label-components.util';

import type { BinaryImageInterface } from '../interfaces/binary-image.interface';
import type { ConnectedComponentInterface } from '../interfaces/connected-component.interface';

const CROSSING_EDGE = 1;
const STROKE_HALF_WIDTH = 3;
const OPPOSITE_EDGES = [
    [0, 2],
    [1, 3]
];

const findTouchedEdges = (component: ConnectedComponentInterface, size: number): number[] =>
    [
        component.minY <= CROSSING_EDGE,
        component.maxX >= size - 1 - CROSSING_EDGE,
        component.maxY >= size - 1 - CROSSING_EDGE,
        component.minX <= CROSSING_EDGE
    ].flatMap((isTouched, edge) => (isTouched ? [edge] : []));

const findCrossedEdges = (component: ConnectedComponentInterface, size: number): number[] => {
    const edges = findTouchedEdges(component, size);

    return OPPOSITE_EDGES.find(pair => pair.every(edge => edges.includes(edge))) ?? [];
};

const measureEdgeContact = (labels: Int32Array, label: number, edge: number, size: number) => {
    const isRowEdge = edge % 2 === 0;
    const first = edge === 1 || edge === 2 ? size - 1 - CROSSING_EDGE : 0;
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    for (let pixel = 0; pixel < labels.length; pixel += 1) {
        const across = isRowEdge ? Math.floor(pixel / size) : pixel % size;

        if (labels[pixel] === label && across >= first && across <= first + CROSSING_EDGE) {
            sumX += pixel % size;
            sumY += Math.floor(pixel / size);
            count += 1;
        }
    }

    return { x: sumX / count, y: sumY / count };
};

const eraseCrossingChord = (data: Uint8Array, labels: Int32Array, component: ConnectedComponentInterface, size: number): void => {
    const [first, second] = findCrossedEdges(component, size).map(edge => measureEdgeContact(labels, component.label, edge, size));
    const length = Math.max(1, Math.hypot(second.x - first.x, second.y - first.y));

    for (let pixel = 0; pixel < data.length; pixel += 1) {
        const x = pixel % size;
        const y = Math.floor(pixel / size);
        const distance = Math.abs((second.x - first.x) * (first.y - y) - (first.x - x) * (second.y - first.y)) / length;

        data[pixel] = labels[pixel] === component.label && distance <= STROKE_HALF_WIDTH ? 0 : data[pixel];
    }
};

export const stripCrossingStrokes = (crop: BinaryImageInterface): BinaryImageInterface => {
    const { labels, components } = labelComponents(crop);
    const data = crop.data.slice();

    const crossingPieces = components.filter(component => findCrossedEdges(component, crop.width).length > 0);

    for (const component of crossingPieces) {
        eraseCrossingChord(data, labels, component, crop.width);
    }

    const stripped = labelComponents({ ...crop, data });
    const crossedEdges = new Set(crossingPieces.flatMap(component => findCrossedEdges(component, crop.width)));
    const isRemainder = [
        false,
        ...stripped.components.map(remainder => findTouchedEdges(remainder, crop.width).some(edge => crossedEdges.has(edge)))
    ];

    for (let pixel = 0; pixel < data.length; pixel += 1) {
        data[pixel] = isRemainder[stripped.labels[pixel]] ? 0 : data[pixel];
    }

    return { ...crop, data };
};
