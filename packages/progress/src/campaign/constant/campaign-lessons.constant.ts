import { SolutionTechniqueEnum } from '@suuudokuuu/techniques';

import type { CampaignLessonInterface } from '../interface/campaign-lesson.interface';

export const campaignLessons: readonly CampaignLessonInterface[] = [
    {
        technique: SolutionTechniqueEnum.FullHouse,
        exampleBoard: '..1..6..5.....5..18521937647956.21382149386576....1942147..95865238674199..514..3',
        practices: [
            {
                id: 'full-house-1',
                board: '..9837261..612.53.2.365.84...271..96..1.4..72764392185..827165...746592.625983714'
            },
            {
                id: 'full-house-2',
                board: '528491637.316758...672839..69231457838..5.2..71..283...59.674.3.46.327..2738491..'
            }
        ]
    },
    {
        technique: SolutionTechniqueEnum.HiddenSingle,
        exampleBoard: '.67..1.82.54..8.711827.3.4.491..685783657.12.27581..3.748192.6.629.8571.513..7298',
        practices: [
            {
                id: 'hidden-single-1',
                board: '..2593876769148532853276914..8.692......8219.2947..368...92..8398563472132.8....9'
            },
            {
                id: 'hidden-single-2',
                board: '1....9.3423854769149..31...974..8513.1239......317.9..5217834693469521787894163..'
            }
        ]
    },
    {
        technique: SolutionTechniqueEnum.NakedSingle,
        exampleBoard: '9.3.68..2862.34.514.7..28367.68.3.252816453973.527..68.38.2.674.7438.2.96294.7..3',
        practices: [
            {
                id: 'naked-single-1',
                board: '195834..7.7..9.483438726951...973.4574..5839.95346...8..9.4.73..643178..327689514'
            },
            {
                id: 'naked-single-2',
                board: '526197834..982457..48.5.1..9...75461.1496..5865.481...261738945495.1..8.8..549612'
            }
        ]
    },
    {
        technique: SolutionTechniqueEnum.PointingPair,
        exampleBoard: '9.3.....2..2.....1..7..2.36..6..3.2...1.4......5....6..3......4.74.8...962.4.7...',
        practices: [
            {
                id: 'pointing-pair-1',
                board: '1.......7......483438726.5.........5....5..9...34....8...........43.7...327...51.'
            },
            {
                id: 'pointing-pair-2',
                board: '.26...834...8.45...........9....54...1..6....6.........6.738945495......8.......2'
            }
        ]
    },
    {
        technique: SolutionTechniqueEnum.PointingTriple,
        exampleBoard: '.91.52.4354.937.122.3..4.59.5...3..443...5..612..49537912378465..5491328384526971',
        practices: [
            {
                id: 'pointing-triple-1',
                board: '.63.521.415.6432.92.4...365.1....45664...5813385461927.....6541526..4738431578692'
            },
            {
                id: 'pointing-triple-2',
                board: '3179862459485..7362567.....8312756944296...57765....2.674...5.31.3457.625.236.47.'
            }
        ]
    },
    {
        technique: SolutionTechniqueEnum.BoxLineReduction,
        exampleBoard: '.486.1.23.362...411.2.3486.2.1...63..8435621.36.12..846..8134.241.7623.8823...176',
        practices: [
            {
                id: 'box-line-reduction-1',
                board: '..23.475954..97.2397325...473..4298...4.6327.2.5.7.43...973.542357429..842...5397'
            },
            {
                id: 'box-line-reduction-2',
                board: '8146...359..135864356.481...45.8.6.3.8347.5...9135..485...6348143.81..561685.43..'
            }
        ]
    },
    {
        technique: SolutionTechniqueEnum.NakedPair,
        exampleBoard: '.....1.73.....7.61172.63.484.71856.221...6857586.721.4.2..1478.8.17.942.745628319',
        practices: [
            {
                id: 'naked-pair-1',
                board: '..2536.98..8.293.5..38.7.26...2...87..79.82.3284673519...792854875.6.932429385..1'
            },
            {
                id: 'naked-pair-2',
                board: '2..694135341.7.689569318...1264875934.39.18..89...3...73.8.94..6.413.9..91.7463..'
            }
        ]
    }
];
