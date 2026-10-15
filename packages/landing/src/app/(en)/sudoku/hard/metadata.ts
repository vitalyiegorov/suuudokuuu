import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const hardSudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/hard',
    title: buildDifficultyPageTitle(DifficultyEnum.Hard),
    headline: 'Hard Sudoku Puzzles',
    metaTitle: 'Hard Sudoku Puzzles — Play Free Online',
    metaDescription:
        'Free hard Sudoku puzzles with 26 clues, every one guaranteed to need a fish or a wing pattern beyond every subset. Play hard-level Sudoku online for free.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-08-23T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8,
    translations: {
        ar: {
            title: 'سودوكو صعب',
            headline: 'ألغاز سودوكو صعب',
            metaTitle: 'سودوكو صعب — العب ألغاز سودوكو مجانا اون لاين',
            metaDescription:
                'ألغاز سودوكو صعب مجانا بـ26 معطى، وكل لغز يحتاج إلى نمط سمكة أو جناح يتجاوز كل المجموعات الجزئية. العب سودوكو صعب اون لاين مجانا.'
        },
        bn: {
            title: 'কঠিন সুডোকু',
            headline: 'কঠিন সুডোকু ধাঁধা',
            metaTitle: 'কঠিন সুডোকু খেলা: অনলাইনে ফ্রি খেলুন',
            metaDescription:
                '26টি সূত্রের বিনামূল্যের কঠিন সুডোকু, প্রতিটিতে সব সাবসেটের পরেও একটি ফিশ বা উইং প্যাটার্ন লাগবেই। বিজ্ঞাপন ছাড়াই অনলাইনে কঠিন সুডোকু খেলুন।'
        },
        de: {
            title: 'Sudoku schwer',
            headline: 'Sudoku schwer online spielen',
            metaTitle: 'Sudoku schwer – kostenlos online spielen',
            metaDescription:
                'Kostenlose schwere Sudokus mit 26 Vorgaben; jedes braucht garantiert einen Fish oder Wing jenseits aller Subsets. Sudoku schwer kostenlos online spielen.'
        },
        es: {
            title: 'Sudoku difícil',
            headline: 'Sudoku difícil',
            metaTitle: 'Sudoku difícil: juega gratis online',
            metaDescription:
                'Sudokus difíciles gratis con 26 pistas, todos con la garantía de necesitar un patrón fish o wing más allá de cualquier subconjunto. Juega online y gratis.'
        },
        fr: {
            title: 'Sudoku Difficile',
            headline: 'Sudoku difficile : grilles gratuites',
            metaTitle: 'Sudoku difficile : jouer gratuitement en ligne',
            metaDescription:
                'Sudoku difficile gratuit avec 26 chiffres donnés, chaque grille exigeant un fish ou un wing au-delà des sous-ensembles. Jouez en ligne gratuitement, sans pub.'
        },
        hi: {
            title: 'कठिन सुडोकू',
            headline: 'कठिन सुडोकू पहेलियाँ',
            metaTitle: 'कठिन सुडोकू गेम — ऑनलाइन फ्री खेलें',
            metaDescription:
                '26 क्लू वाली मुफ़्त कठिन सुडोकू पहेलियाँ, जिनमें हर सबसेट के बाद भी फ़िश या विंग पैटर्न ज़रूर लगता है। कठिन सुडोकू ऑनलाइन मुफ़्त खेलें, बिना विज्ञापन।'
        },
        id: {
            title: 'Sudoku Sulit',
            headline: 'Sudoku Sulit: Main Sudoku Online Gratis',
            metaTitle: 'Sudoku Sulit: Main Sudoku Online Gratis',
            metaDescription:
                'Sudoku sulit gratis dengan 26 angka awal, setiap sudoku dijamin butuh pola fish atau wing di atas semua subset. Main sudoku sulit online gratis, tanpa iklan.'
        },
        'pt-BR': {
            title: 'Sudoku Difícil',
            headline: 'Sudoku Difícil para Jogar Online',
            metaTitle: 'Sudoku difícil: jogar sudoku online grátis',
            metaDescription:
                'Sudokus difíceis grátis, com 26 pistas, que sempre exigem um fish ou um padrão de wing além de todos os subconjuntos. Jogue sudoku difícil online de graça.'
        },
        sv: {
            title: 'Svår sudoku',
            headline: 'Svår sudoku – spela gratis online',
            metaTitle: 'Svår sudoku – spela gratis online',
            metaDescription:
                'Gratis svår sudoku med 26 givna siffror, varje sudoku kräver en fisk eller en wing bortom alla delmängder. Spela svår sudoku online gratis, utan reklam.'
        },
        uk: {
            title: 'Важке судоку',
            headline: 'Складні судоку (важкий рівень)',
            metaTitle: 'Складні судоку — грати онлайн безкоштовно',
            metaDescription:
                'Безкоштовні складні судоку з 26 підказками: кожне гарантовано потребує фігури «риба» або «крило», складнішої за будь-яку підмножину. Грайте онлайн без реклами.'
        },
        ur: {
            title: 'مشکل سوڈوکو',
            headline: 'مشکل سوڈوکو پزلز',
            metaTitle: 'مشکل سوڈوکو پزلز — آن لائن مفت کھیلیں',
            metaDescription:
                '26 کلیوز والے مفت مشکل سوڈوکو پزلز، جن میں ہر ایک کو تمام سبسیٹس کے بعد فش یا ونگ پیٹرن کی ضرورت ہوتی ہے۔ مشکل سوڈوکو آن لائن مفت کھیلیں۔'
        },
        zh: {
            title: '困难数独',
            headline: '困难数独',
            metaTitle: '困难数独在线玩：免费困难数独',
            metaDescription: '免费困难数独，26 个已知数字，每道题保证需要超出所有数组的鱼形或翼形。免费在线玩困难级数独。'
        }
    }
};
