import { StyleSheet } from 'react-native-unistyles';

export const FieldCellCandidateStyles = StyleSheet.create(() => ({
    textCandidate: (cellSize: number) => ({
        paddingHorizontal: cellSize * 0.05,
        position: 'absolute'
    }),
    textCandidatePosition1: (cellSize: number) => ({ left: cellSize * 0.05, top: cellSize * 0.05 }),
    textCandidatePosition2: (cellSize: number) => ({ left: (cellSize * 0.05) / 2 + cellSize / 3, top: cellSize * 0.05 }),
    textCandidatePosition3: (cellSize: number) => ({ right: cellSize * 0.05, top: cellSize * 0.05 }),
    textCandidatePosition4: (cellSize: number) => ({ left: cellSize * 0.05, top: cellSize / 3 }),
    textCandidatePosition5: (cellSize: number) => ({ left: (cellSize * 0.05) / 2 + cellSize / 3, top: cellSize / 3 }),
    textCandidatePosition6: (cellSize: number) => ({ right: cellSize * 0.05, top: cellSize / 3 }),
    textCandidatePosition7: (cellSize: number) => ({ bottom: cellSize * 0.05, left: cellSize * 0.05 }),
    textCandidatePosition8: (cellSize: number) => ({ bottom: cellSize * 0.05, left: (cellSize * 0.05) / 2 + cellSize / 3 }),
    textCandidatePosition9: (cellSize: number) => ({ bottom: cellSize * 0.05, right: cellSize * 0.05 })
}));
