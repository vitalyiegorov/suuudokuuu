import {CellInterface} from "../../interfaces/cell.interface";
import {Cell} from "../cell/cell";
import {RowStyles} from "./row.styles";
import {View} from "react-native";

interface Props {
    row: number;
    cells: CellInterface[];
}

export const Row = ({row, cells }: Props) => {
    return <View style={RowStyles.row}>{cells.map((cell, j) => <Cell key={row + j} row={row} col={j}/>)}</View>;
}