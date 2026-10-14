import { SITE_DESCRIPTION, SITE_NAME } from '../../seo/constants/site.constant';

import type { PageMetadataInterface } from '../../seo/interfaces/page-metadata.interface';

export const homePageMetadata: PageMetadataInterface = {
    path: '/',
    title: SITE_NAME,
    headline: 'Play Free Online Sudoku',
    metaTitle: 'Play Sudoku Online Free — No Ads, Seven Difficulty Levels',
    metaDescription: SITE_DESCRIPTION,
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 1,
    translations: {
        es: {
            title: SITE_NAME,
            headline: 'Juega al sudoku online gratis',
            metaTitle: 'Sudoku online gratis: sin anuncios y con siete niveles de dificultad',
            metaDescription:
                'Suuudokuuu es un sudoku gratuito y sin anuncios que funciona sin conexión. Siete niveles de dificultad, pistas que explican cada técnica, rachas y sudokus para compartir.'
        }
    }
};
