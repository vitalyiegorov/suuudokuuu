import {Row} from "../row/row";

export const Field = () => {
    const matrix = Array(9).fill(Array(9).fill(0));

    return <>{matrix.map((row, i) => <Row key={i} row={i} cells={row} />)}</>;
}