import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const mediumSudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/medium',
    title: buildDifficultyPageTitle(DifficultyEnum.Medium),
    headline: 'Medium Sudoku Puzzles',
    metaTitle: 'Medium Sudoku Puzzles — Play Free Online',
    metaDescription:
        'Free medium Sudoku puzzles with 27 clues, every one guaranteed to need pointing pairs, box line reduction or a naked or hidden subset. Play free online.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-14T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8,
    translations: {
        ar: {
            title: 'سودوكو متوسط',
            headline: 'ألغاز سودوكو متوسط',
            metaTitle: 'سودوكو متوسط — العب ألغاز سودوكو مجانا اون لاين',
            metaDescription:
                'ألغاز سودوكو متوسط مجانا بـ27 معطى، وكل لغز يحتاج إلى زوج موجّه أو تخفيض الصندوق والخط أو مجموعة مكشوفة أو خفية. العب سودوكو اون لاين مجانا.'
        },
        bn: {
            title: 'মাঝারি সুডোকু',
            headline: 'মাঝারি সুডোকু ধাঁধা',
            metaTitle: 'মাঝারি সুডোকু খেলা: অনলাইনে ফ্রি খেলুন',
            metaDescription:
                '27টি সূত্রের বিনামূল্যের মাঝারি সুডোকু, প্রতিটিতে পয়েন্টিং পেয়ার, বক্স-লাইন হ্রাস বা উন্মুক্ত অথবা লুকানো সাবসেট লাগবেই। বিনামূল্যে অনলাইনে খেলুন।'
        },
        de: {
            title: 'Sudoku mittelschwer',
            headline: 'Sudoku mittelschwer online spielen',
            metaTitle: 'Sudoku mittelschwer – kostenlos online spielen',
            metaDescription:
                'Kostenlose mittelschwere Sudokus mit 27 Vorgaben; jedes braucht garantiert Zeigende Paare, Box-Zeilen-Reduktion oder ein Subset. Kostenlos online spielen.'
        },
        es: {
            title: 'Sudoku intermedio',
            headline: 'Sudoku intermedio',
            metaTitle: 'Sudoku intermedio: juega gratis online',
            metaDescription:
                'Sudokus intermedios gratis con 27 pistas, todos con la garantía de necesitar pares apuntadores, reducción caja-línea o un subconjunto. Juega gratis online.'
        },
        fr: {
            title: 'Sudoku Moyen',
            headline: 'Sudoku moyen : grilles gratuites',
            metaTitle: 'Sudoku moyen : jouer gratuitement en ligne',
            metaDescription:
                'Sudoku moyen gratuit avec 27 chiffres donnés, chaque grille exigeant paires pointées, réduction bloc-ligne ou un sous-ensemble nu ou caché. Jouez gratuitement.'
        },
        hi: {
            title: 'मध्यम सुडोकू',
            headline: 'मध्यम सुडोकू पहेलियाँ',
            metaTitle: 'मध्यम सुडोकू गेम — ऑनलाइन फ्री खेलें',
            metaDescription:
                '27 क्लू वाली मुफ़्त मध्यम सुडोकू पहेलियाँ, जिनमें संकेतक जोड़ा, बॉक्स-लाइन न्यूनीकरण या खुला व छिपा सबसेट ज़रूर लगता है। ऑनलाइन मुफ़्त खेलें।'
        },
        id: {
            title: 'Sudoku Sedang',
            headline: 'Sudoku Sedang: Main Sudoku Online Gratis',
            metaTitle: 'Sudoku Sedang: Main Sudoku Online Gratis',
            metaDescription:
                'Sudoku sedang gratis dengan 27 angka awal, setiap sudoku dijamin butuh pasangan penunjuk, reduksi kotak-baris, atau subset telanjang/tersembunyi. Main gratis.'
        },
        'pt-BR': {
            title: 'Sudoku Médio',
            headline: 'Sudoku Médio para Jogar Online',
            metaTitle: 'Sudoku médio: jogar sudoku online grátis',
            metaDescription:
                'Sudokus médios grátis, com 27 pistas, que sempre exigem pares apontadores, redução caixa-linha ou um subconjunto nu ou oculto. Jogue online de graça.'
        },
        sv: {
            title: 'Medelsvår sudoku',
            headline: 'Medelsvår sudoku – spela gratis online',
            metaTitle: 'Medelsvår sudoku – spela gratis online',
            metaDescription:
                'Gratis medelsvår sudoku med 27 givna siffror, varje sudoku kräver pekande par, block-rad-reduktion eller ett naket eller dolt par. Spela gratis online.'
        },
        uk: {
            title: 'Середнє судоку',
            headline: 'Середні судоку',
            metaTitle: 'Середні судоку — грати онлайн безкоштовно',
            metaDescription:
                'Безкоштовні середні судоку з 27 підказками: кожне гарантовано потребує вказівних пар, взаємодії блока і лінії або відкритої чи прихованої підмножини.'
        },
        ur: {
            title: 'درمیانہ سوڈوکو',
            headline: 'درمیانہ سوڈوکو پزلز',
            metaTitle: 'درمیانہ سوڈوکو پزلز — آن لائن مفت کھیلیں',
            metaDescription:
                '27 کلیوز والے مفت درمیانہ سوڈوکو پزلز، جن میں ہر ایک کو اشارہ کرتے جوڑوں، باکس لائن ریڈکشن یا کھلے یا پوشیدہ سبسیٹ کی ضرورت ہوتی ہے۔ آن لائن مفت کھیلیں۔'
        },
        zh: {
            title: '中等数独',
            headline: '中等数独',
            metaTitle: '中等数独在线玩：免费中等数独',
            metaDescription: '免费中等数独，27 个已知数字，每道题保证需要指向数对、宫线消解或显性、隐性数组。免费在线玩。'
        }
    }
};
