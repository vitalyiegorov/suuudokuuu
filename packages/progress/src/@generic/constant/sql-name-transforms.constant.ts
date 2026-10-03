import { camelToSnake, snakeToCamel } from 'effect/String';

export const SqlNameTransforms = {
    transformQueryNames: camelToSnake,
    transformResultNames: snakeToCamel
} as const;
