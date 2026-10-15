import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const hellSudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/hell',
    title: buildDifficultyPageTitle(DifficultyEnum.Hell),
    headline: 'Evil Sudoku Puzzles (Hell Level)',
    metaTitle: 'Evil Sudoku (Hell Level) — The Hardest Free Puzzles Online',
    metaDescription:
        'Free evil, extreme Sudoku where every board needs a forcing chain, beyond chains, coloring and AIC. Play the hardest Hell-level Sudoku online for free.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-14T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8,
    translations: {
        ar: {
            title: 'سودوكو جحيم',
            headline: 'سودوكو شرير (مستوى جحيم)',
            metaTitle: 'سودوكو شرير (مستوى جحيم) — أصعب ألغاز مجانية اون لاين',
            metaDescription:
                'سودوكو شرير ومتطرف مجانا، وكل لوحة تحتاج إلى سلسلة إجبار بعد السلاسل والتلوين وAIC. العب أصعب ألغاز سودوكو بمستوى جحيم اون لاين مجانا.'
        },
        bn: {
            title: 'নরক সুডোকু',
            headline: 'ইভিল সুডোকু ধাঁধা (নরক স্তর)',
            metaTitle: 'ইভিল সুডোকু (নরক স্তর): সবচেয়ে কঠিন সুডোকু ফ্রি',
            metaDescription:
                'বিনামূল্যের ইভিল, এক্সট্রিম সুডোকু, যার প্রতিটি বোর্ডে শৃঙ্খল, রঙকরণ ও AIC-এর পরেও বাধ্যকারী শৃঙ্খল লাগে। সবচেয়ে কঠিন নরক স্তরের সুডোকু অনলাইনে খেলুন।'
        },
        de: {
            title: 'Sudoku Hölle',
            headline: 'Sudoku extrem schwer (Hölle)',
            metaTitle: 'Sudoku extrem schwer (Hölle) – kostenlos online',
            metaDescription:
                'Kostenloses extremes Sudoku, bei dem jedes Rätsel eine Zwangskette braucht, mehr als Ketten, Färben und AIC. Das schwerste Sudoku der Hölle online spielen.'
        },
        es: {
            title: 'Sudoku infierno',
            headline: 'Sudoku diabólico (nivel Infierno)',
            metaTitle: 'Sudoku diabólico (Infierno): los más difíciles',
            metaDescription:
                'Sudoku diabólico gratis: cada tablero exige una cadena forzada, más allá de las cadenas, el coloreado y AIC. Juega online y gratis al nivel Infierno.'
        },
        fr: {
            title: 'Sudoku Enfer',
            headline: 'Sudoku diabolique (niveau Enfer)',
            metaTitle: 'Sudoku diabolique (Enfer) : les grilles les plus dures',
            metaDescription:
                'Sudoku diabolique et extrême gratuit : chaque grille exige une chaîne forcée, au-delà des chaînes, du coloriage et de l’AIC. Jouez au sudoku Enfer gratuitement.'
        },
        hi: {
            title: 'नरक सुडोकू',
            headline: 'ईविल सुडोकू पहेलियाँ (नरक स्तर)',
            metaTitle: 'ईविल सुडोकू (नरक स्तर) — सबसे कठिन सुडोकू फ्री',
            metaDescription:
                'मुफ़्त ईविल, एक्सट्रीम सुडोकू, जिसके हर बोर्ड को शृंखला, रंगाई और AIC से आगे बाध्यकारी शृंखला चाहिए। सबसे कठिन नरक सुडोकू ऑनलाइन मुफ़्त खेलें।'
        },
        id: {
            title: 'Sudoku Neraka',
            headline: 'Sudoku Tersulit (Tingkat Neraka)',
            metaTitle: 'Sudoku Tersulit (Neraka): Main Online Gratis',
            metaDescription:
                'Sudoku evil dan extreme gratis, setiap sudoku butuh rantai paksa, melampaui rantai, pewarnaan, dan AIC. Main sudoku tingkat Neraka paling sulit online gratis.'
        },
        'pt-BR': {
            title: 'Sudoku Inferno',
            headline: 'Sudoku Diabólico (Nível Inferno)',
            metaTitle: 'Sudoku diabólico (Inferno): os mais difíceis grátis',
            metaDescription:
                'Sudoku diabólico e extremo grátis em que todo tabuleiro exige uma cadeia forçada, além de cadeias, coloração e AIC. Jogue o sudoku Inferno online de graça.'
        },
        sv: {
            title: 'Helvete-sudoku',
            headline: 'Svåraste sudoku – extrem nivå Helvete',
            metaTitle: 'Svårast sudoku (Helvete) – extrema pussel gratis online',
            metaDescription:
                'Gratis extrem sudoku där varje sudoku kräver en tvingande kedja, bortom kedjor, färgläggning och AIC. Spela de svåraste sudokuna på Helvete gratis online.'
        },
        uk: {
            title: 'Судоку «Пекло»',
            headline: 'Найскладніші судоку (рівень «Пекло»)',
            metaTitle: 'Найскладніші судоку онлайн — рівень «Пекло» безкоштовно',
            metaDescription:
                'Безкоштовне екстремальне судоку, де кожна дошка потребує примусового ланцюга, понад ланцюги, розфарбування й AIC. Грайте в найскладніше судоку рівня «Пекло».'
        },
        ur: {
            title: 'جہنم سوڈوکو',
            headline: 'انتہائی مشکل سوڈوکو پزلز (جہنم درجہ)',
            metaTitle: 'انتہائی مشکل سوڈوکو (جہنم) — سب سے سخت مفت پزلز',
            metaDescription:
                'مفت انتہائی مشکل سوڈوکو جس کے ہر بورڈ کو جبری زنجیر کی ضرورت ہے، زنجیروں، رنگ کاری اور AIC سے بھی آگے۔ جہنم درجے کا سب سے مشکل سوڈوکو آن لائن مفت کھیلیں۔'
        },
        zh: {
            title: '地狱数独',
            headline: '魔鬼数独（地狱级）',
            metaTitle: '魔鬼数独（地狱级）：最难的免费数独',
            metaDescription: '免费魔鬼级极限数独，每个盘面都需要强制链，超出链、染色和 AIC。免费在线玩最难的地狱级数独。'
        }
    }
};
