import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const easySudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/easy',
    title: buildDifficultyPageTitle(DifficultyEnum.Easy),
    headline: 'Easy Sudoku Puzzles',
    metaTitle: 'Easy Sudoku Puzzles — Play Free Online',
    metaDescription:
        'Free easy Sudoku puzzles with 31 clues, every one guaranteed to need a hidden single and nothing harder. Play easy-level Sudoku online for free, no ads.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-14T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8,
    translations: {
        ar: {
            title: 'سودوكو سهل',
            headline: 'ألغاز سودوكو سهل',
            metaTitle: 'سودوكو سهل — العب ألغاز سودوكو مجانا اون لاين',
            metaDescription:
                'ألغاز سودوكو سهل مجانا بـ31 معطى، وكل لغز يحتاج إلى مفرد خفي واحد على الأقل دون ما هو أصعب. العب سودوكو سهل اون لاين مجانا وبلا إعلانات.'
        },
        bn: {
            title: 'সহজ সুডোকু',
            headline: 'সহজ সুডোকু ধাঁধা',
            metaTitle: 'সহজ সুডোকু খেলা: অনলাইনে ফ্রি খেলুন',
            metaDescription:
                '31টি সূত্রের বিনামূল্যের সহজ সুডোকু, প্রতিটিতে একটি লুকানো একক লাগবেই, এর চেয়ে কঠিন কিছু নয়। বিজ্ঞাপন ছাড়াই অনলাইনে সহজ সুডোকু খেলুন।'
        },
        de: {
            title: 'Sudoku leicht',
            headline: 'Sudoku leicht online spielen',
            metaTitle: 'Sudoku leicht – kostenlos online spielen',
            metaDescription:
                'Kostenlose leichte Sudokus mit 31 Vorgaben, jedes braucht garantiert ein verdecktes Single und nichts Schwierigeres. Sudoku leicht online spielen, ohne Werbung.'
        },
        es: {
            title: 'Sudoku fácil',
            headline: 'Sudoku fácil',
            metaTitle: 'Sudoku fácil: juega gratis online',
            metaDescription:
                'Sudokus fáciles gratis con 31 pistas, todos con la garantía de necesitar un único oculto y nada más difícil. Juega al sudoku fácil online y gratis, sin anuncios.'
        },
        fr: {
            title: 'Sudoku Facile',
            headline: 'Sudoku facile : grilles gratuites',
            metaTitle: 'Sudoku facile : jouer gratuitement en ligne',
            metaDescription:
                'Sudoku facile gratuit avec 31 chiffres donnés, chaque grille exigeant un singleton caché et rien de plus difficile. Jouez en ligne gratuitement, sans publicité.'
        },
        hi: {
            title: 'आसान सुडोकू',
            headline: 'आसान सुडोकू पहेलियाँ',
            metaTitle: 'आसान सुडोकू गेम — ऑनलाइन फ्री खेलें',
            metaDescription:
                '31 क्लू वाली मुफ़्त आसान सुडोकू पहेलियाँ, जिनमें एक छिपा एकल ज़रूर लगता है और उससे कठिन कुछ नहीं। आसान सुडोकू ऑनलाइन मुफ़्त खेलें, बिना विज्ञापन।'
        },
        id: {
            title: 'Sudoku Mudah',
            headline: 'Sudoku Mudah: Main Sudoku Online Gratis',
            metaTitle: 'Sudoku Mudah: Main Sudoku Online Gratis',
            metaDescription:
                'Sudoku mudah gratis dengan 31 angka awal, setiap sudoku dijamin butuh tunggal tersembunyi dan tidak lebih sulit. Main sudoku mudah online gratis, tanpa iklan.'
        },
        'pt-BR': {
            title: 'Sudoku Fácil',
            headline: 'Sudoku Fácil para Jogar Online',
            metaTitle: 'Sudoku fácil: jogar sudoku online grátis',
            metaDescription:
                'Sudokus fáceis grátis, com 31 pistas, que exigem no máximo um único oculto e nada mais difícil. Jogue sudoku fácil online de graça e sem anúncios.'
        },
        sv: {
            title: 'Lätt sudoku',
            headline: 'Lätt sudoku – spela gratis online',
            metaTitle: 'Lätt sudoku – spela gratis online',
            metaDescription:
                'Gratis lätt sudoku med 31 givna siffror, garanterat med minst en dold singel men inget svårare. Spela lätt sudoku online gratis, utan reklam.'
        },
        uk: {
            title: 'Легке судоку',
            headline: 'Легкі судоку',
            metaTitle: 'Легкі судоку — грати онлайн безкоштовно',
            metaDescription:
                'Безкоштовні легкі судоку з 31 підказкою: кожне гарантовано потребує прихованого одинака і нічого складнішого. Грайте в легке судоку онлайн без реклами.'
        },
        ur: {
            title: 'آسان سوڈوکو',
            headline: 'آسان سوڈوکو پزلز',
            metaTitle: 'آسان سوڈوکو پزلز — آن لائن مفت کھیلیں',
            metaDescription:
                '31 کلیوز والے مفت آسان سوڈوکو پزلز، جن میں ہر ایک کو ایک پوشیدہ اکہرے کی ضرورت ہوتی ہے اور اس سے مشکل کچھ نہیں۔ آسان سوڈوکو آن لائن مفت، بغیر اشتہارات۔'
        },
        zh: {
            title: '简单数独',
            headline: '简单数独',
            metaTitle: '简单数独在线玩：免费简单数独',
            metaDescription: '免费简单数独，31 个已知数字，每道题保证需要隐性单数，且不需要更难的技巧。免费在线玩简单级数独，无广告。'
        }
    }
};
