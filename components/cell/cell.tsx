import { View, Text } from "react-native"
import {CellStyles} from "./cell.styles";

interface Props {
    row: number;
    col: number;
}

export const Cell = ({row, col}: Props) => {
    return (
        <View style={CellStyles.cell}>
            <Text>{row}-{col}</Text>
        </View>
    )
}