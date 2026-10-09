import { StyleSheet } from 'react-native-unistyles';

export const FieldCellCandidateStyles = StyleSheet.create(() => ({
    textCandidate: (cellSize: number) => ({
        height: (cellSize - 2) / 3,
        includeFontPadding: false,
        lineHeight: (cellSize - 2) / 3,
        position: 'absolute',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: (cellSize - 2) / 3
    }),
    textCandidatePosition1: () => ({ left: 0, top: 0 }),
    textCandidatePosition2: (cellSize: number) => ({ left: (cellSize - 2) / 3, top: 0 }),
    textCandidatePosition3: (cellSize: number) => ({ left: ((cellSize - 2) * 2) / 3, top: 0 }),
    textCandidatePosition4: (cellSize: number) => ({ left: 0, top: (cellSize - 2) / 3 }),
    textCandidatePosition5: (cellSize: number) => ({ left: (cellSize - 2) / 3, top: (cellSize - 2) / 3 }),
    textCandidatePosition6: (cellSize: number) => ({ left: ((cellSize - 2) * 2) / 3, top: (cellSize - 2) / 3 }),
    textCandidatePosition7: (cellSize: number) => ({ left: 0, top: ((cellSize - 2) * 2) / 3 }),
    textCandidatePosition8: (cellSize: number) => ({ left: (cellSize - 2) / 3, top: ((cellSize - 2) * 2) / 3 }),
    textCandidatePosition9: (cellSize: number) => ({ left: ((cellSize - 2) * 2) / 3, top: ((cellSize - 2) * 2) / 3 })
}));
