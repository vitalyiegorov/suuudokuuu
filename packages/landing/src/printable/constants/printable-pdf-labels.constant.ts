import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../difficulty/utils/build-difficulty-page-title.util';

import type { DEFAULT_LOCALE } from '../../seo/constants/site.constant';
import type { LocaleType } from '../../seo/types/locale.type';
import type { PrintablePdfLabelsInterface } from '../interfaces/printable-pdf-labels.interface';

export const PRINTABLE_PDF_LABELS: Readonly<
    Record<typeof DEFAULT_LOCALE, PrintablePdfLabelsInterface> & Partial<Record<LocaleType, PrintablePdfLabelsInterface>>
> = {
    en: {
        bookletNames: {
            [DifficultyEnum.Newbie]: buildDifficultyPageTitle(DifficultyEnum.Newbie),
            [DifficultyEnum.Easy]: buildDifficultyPageTitle(DifficultyEnum.Easy),
            [DifficultyEnum.Medium]: buildDifficultyPageTitle(DifficultyEnum.Medium),
            [DifficultyEnum.Hard]: buildDifficultyPageTitle(DifficultyEnum.Hard),
            [DifficultyEnum.Nightmare]: buildDifficultyPageTitle(DifficultyEnum.Nightmare),
            [DifficultyEnum.Hell]: buildDifficultyPageTitle(DifficultyEnum.Hell),
            [DifficultyEnum.Infinity]: buildDifficultyPageTitle(DifficultyEnum.Infinity)
        },
        puzzlesHeading: 'Puzzles',
        solutionsHeading: 'Solutions',
        puzzleLabel: 'Puzzle',
        solutionLabel: 'Solution',
        documentTitle: bookletName => `${bookletName} — Printable Puzzle Booklet`,
        puzzleCountLine: puzzleCount => `${puzzleCount} free printable puzzles with solutions`,
        pageCountLine: (pageCount, puzzlesPerPage) => `${pageCount}-page PDF, US Letter, ${puzzlesPerPage} puzzles per page`,
        playMoreLine: siteOrigin => `Play more at ${siteOrigin}`
    },
    de: {
        bookletNames: {
            [DifficultyEnum.Newbie]: 'Sudoku Anfänger',
            [DifficultyEnum.Easy]: 'Sudoku Einfach',
            [DifficultyEnum.Medium]: 'Sudoku Mittelschwer',
            [DifficultyEnum.Hard]: 'Sudoku Schwer',
            [DifficultyEnum.Nightmare]: 'Sudoku Albtraum',
            [DifficultyEnum.Hell]: 'Sudoku Hölle',
            [DifficultyEnum.Infinity]: 'Sudoku Unendlich'
        },
        puzzlesHeading: 'Rätsel',
        solutionsHeading: 'Lösungen',
        puzzleLabel: 'Rätsel',
        solutionLabel: 'Lösung',
        documentTitle: bookletName => `${bookletName}: Rätselheft zum Ausdrucken`,
        puzzleCountLine: puzzleCount => `${puzzleCount} kostenlose Sudokus zum Ausdrucken, mit Lösungen`,
        pageCountLine: (pageCount, puzzlesPerPage) => `PDF mit ${pageCount} Seiten, US-Letter, ${puzzlesPerPage} Rätsel pro Seite`,
        playMoreLine: siteOrigin => `Mehr Sudoku auf ${siteOrigin}`
    },
    es: {
        bookletNames: {
            [DifficultyEnum.Newbie]: 'Sudoku Novato',
            [DifficultyEnum.Easy]: 'Sudoku Fácil',
            [DifficultyEnum.Medium]: 'Sudoku Intermedio',
            [DifficultyEnum.Hard]: 'Sudoku Difícil',
            [DifficultyEnum.Nightmare]: 'Sudoku Pesadilla',
            [DifficultyEnum.Hell]: 'Sudoku Infierno',
            [DifficultyEnum.Infinity]: 'Sudoku Infinito'
        },
        puzzlesHeading: 'Sudokus',
        solutionsHeading: 'Soluciones',
        puzzleLabel: 'Sudoku',
        solutionLabel: 'Solución',
        documentTitle: bookletName => `${bookletName}: cuadernillo para imprimir`,
        puzzleCountLine: puzzleCount => `${puzzleCount} sudokus gratis para imprimir, con soluciones`,
        pageCountLine: (pageCount, puzzlesPerPage) => `PDF de ${pageCount} páginas, tamaño carta, ${puzzlesPerPage} sudokus por página`,
        playMoreLine: siteOrigin => `Juega más en ${siteOrigin}`
    },
    fr: {
        bookletNames: {
            [DifficultyEnum.Newbie]: 'Sudoku Novice',
            [DifficultyEnum.Easy]: 'Sudoku Facile',
            [DifficultyEnum.Medium]: 'Sudoku Moyen',
            [DifficultyEnum.Hard]: 'Sudoku Difficile',
            [DifficultyEnum.Nightmare]: 'Sudoku Cauchemar',
            [DifficultyEnum.Hell]: 'Sudoku Enfer',
            [DifficultyEnum.Infinity]: 'Sudoku Infini'
        },
        puzzlesHeading: 'Grilles',
        solutionsHeading: 'Solutions',
        puzzleLabel: 'Grille',
        solutionLabel: 'Solution',
        documentTitle: bookletName => `${bookletName} : cahier de grilles à imprimer`,
        puzzleCountLine: puzzleCount => `${puzzleCount} grilles gratuites à imprimer, avec les solutions`,
        pageCountLine: (pageCount, puzzlesPerPage) => `PDF de ${pageCount} pages, format US Letter, ${puzzlesPerPage} grilles par page`,
        playMoreLine: siteOrigin => `Encore plus de grilles sur ${siteOrigin}`
    },
    id: {
        bookletNames: {
            [DifficultyEnum.Newbie]: 'Sudoku Pemula',
            [DifficultyEnum.Easy]: 'Sudoku Mudah',
            [DifficultyEnum.Medium]: 'Sudoku Sedang',
            [DifficultyEnum.Hard]: 'Sudoku Sulit',
            [DifficultyEnum.Nightmare]: 'Sudoku Mimpi Buruk',
            [DifficultyEnum.Hell]: 'Sudoku Neraka',
            [DifficultyEnum.Infinity]: 'Sudoku Tak Terhingga'
        },
        puzzlesHeading: 'Teka-teki',
        solutionsHeading: 'Solusi',
        puzzleLabel: 'Teka-teki',
        solutionLabel: 'Solusi',
        documentTitle: bookletName => `${bookletName}: buku teka-teki siap cetak`,
        puzzleCountLine: puzzleCount => `${puzzleCount} sudoku gratis siap cetak, lengkap dengan solusi`,
        pageCountLine: (pageCount, puzzlesPerPage) => `PDF ${pageCount} halaman, ukuran US Letter, ${puzzlesPerPage} teka-teki per halaman`,
        playMoreLine: siteOrigin => `Main lebih banyak di ${siteOrigin}`
    },
    'pt-BR': {
        bookletNames: {
            [DifficultyEnum.Newbie]: 'Sudoku Iniciante',
            [DifficultyEnum.Easy]: 'Sudoku Fácil',
            [DifficultyEnum.Medium]: 'Sudoku Médio',
            [DifficultyEnum.Hard]: 'Sudoku Difícil',
            [DifficultyEnum.Nightmare]: 'Sudoku Pesadelo',
            [DifficultyEnum.Hell]: 'Sudoku Inferno',
            [DifficultyEnum.Infinity]: 'Sudoku Infinito'
        },
        puzzlesHeading: 'Jogos',
        solutionsHeading: 'Soluções',
        puzzleLabel: 'Jogo',
        solutionLabel: 'Solução',
        documentTitle: bookletName => `${bookletName}: caderno para imprimir`,
        puzzleCountLine: puzzleCount => `${puzzleCount} sudokus grátis para imprimir, com as soluções`,
        pageCountLine: (pageCount, puzzlesPerPage) => `PDF de ${pageCount} páginas, tamanho carta, ${puzzlesPerPage} jogos por página`,
        playMoreLine: siteOrigin => `Jogue mais em ${siteOrigin}`
    },
    sv: {
        bookletNames: {
            [DifficultyEnum.Newbie]: 'Sudoku Nybörjare',
            [DifficultyEnum.Easy]: 'Sudoku Lätt',
            [DifficultyEnum.Medium]: 'Sudoku Medel',
            [DifficultyEnum.Hard]: 'Sudoku Svår',
            [DifficultyEnum.Nightmare]: 'Sudoku Mardröm',
            [DifficultyEnum.Hell]: 'Sudoku Helvete',
            [DifficultyEnum.Infinity]: 'Sudoku Oändlighet'
        },
        puzzlesHeading: 'Sudokun',
        solutionsHeading: 'Lösningar',
        puzzleLabel: 'Sudoku',
        solutionLabel: 'Lösning',
        documentTitle: bookletName => `${bookletName} – häfte att skriva ut`,
        puzzleCountLine: puzzleCount => `${puzzleCount} gratis sudokun att skriva ut, med lösningar`,
        pageCountLine: (pageCount, puzzlesPerPage) => `PDF på ${pageCount} sidor, US Letter, ${puzzlesPerPage} sudokun per sida`,
        playMoreLine: siteOrigin => `Spela fler på ${siteOrigin}`
    }
};
