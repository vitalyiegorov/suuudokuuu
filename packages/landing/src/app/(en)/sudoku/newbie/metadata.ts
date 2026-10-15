import { DifficultyEnum } from '@suuudokuuu/generator';

import { buildDifficultyPageTitle } from '../../../../difficulty/utils/build-difficulty-page-title.util';

import type { PageMetadataInterface } from '../../../../seo/interfaces/page-metadata.interface';

export const newbieSudokuPageMetadata: PageMetadataInterface = {
    path: '/sudoku/newbie',
    title: buildDifficultyPageTitle(DifficultyEnum.Newbie),
    headline: 'Beginner Sudoku Puzzles (Newbie Level)',
    metaTitle: 'Beginner Sudoku Puzzles (Newbie Level) — Play Free Online',
    metaDescription:
        'Free beginner Sudoku puzzles with 37 clues, guaranteed solvable with full houses and naked singles alone. Play Newbie-level Sudoku online, no ads, no sign-up.',
    publishedAt: '2026-08-11T00:00:00.000Z',
    updatedAt: '2026-10-06T00:00:00.000Z',
    changeFrequency: 'weekly',
    priority: 0.8,
    translations: {
        ar: {
            title: 'سودوكو مبتدئ',
            headline: 'سودوكو للمبتدئين (مستوى مبتدئ)',
            metaTitle: 'سودوكو للمبتدئين (مستوى مبتدئ) — العب مجانا اون لاين',
            metaDescription:
                'ألغاز سودوكو للمبتدئين مجانا بـ37 معطى، تُحل بآخر خانة فارغة والمفرد المكشوف وحدهما. العب سودوكو مبتدئ اون لاين بلا إعلانات وبلا تسجيل.'
        },
        bn: {
            title: 'নতুন সুডোকু',
            headline: 'নতুনদের সুডোকু ধাঁধা (নতুন স্তর)',
            metaTitle: 'নতুনদের সুডোকু খেলা (নতুন স্তর): অনলাইনে ফ্রি',
            metaDescription:
                '37টি সূত্রের বিনামূল্যের নতুনদের সুডোকু, যা শুধু শেষ খালি ঘর ও উন্মুক্ত একক দিয়েই সমাধানযোগ্য। বিজ্ঞাপন ও সাইন-আপ ছাড়াই অনলাইনে নতুন স্তরের সুডোকু খেলুন।'
        },
        de: {
            title: 'Sudoku für Anfänger',
            headline: 'Sudoku für Anfänger online spielen',
            metaTitle: 'Sudoku für Anfänger – kostenlos online spielen',
            metaDescription:
                'Kostenlose Sudokus für Anfänger mit 37 Vorgaben, garantiert allein mit letzten freien Zellen und nackten Singles lösbar. Ohne Werbung, ohne Anmeldung.'
        },
        es: {
            title: 'Sudoku para novatos',
            headline: 'Sudoku para principiantes (nivel Novato)',
            metaTitle: 'Sudoku para principiantes: juega gratis online',
            metaDescription:
                'Sudokus gratis para principiantes con 37 pistas, resolubles solo con últimas celdas libres y únicos desnudos. Juega nivel Novato online, sin anuncios ni registro.'
        },
        fr: {
            title: 'Sudoku Novice',
            headline: 'Sudoku pour débutants (niveau Novice)',
            metaTitle: 'Sudoku facile pour débutants : jouer gratuitement',
            metaDescription:
                'Sudoku gratuit pour débutants avec 37 chiffres donnés, soluble avec de simples dernières cases libres et singletons nus. Jouez en ligne sans pub ni inscription.'
        },
        hi: {
            title: 'नया खिलाड़ी सुडोकू',
            headline: 'आसान सुडोकू गेम: शुरुआती के लिए (नया खिलाड़ी स्तर)',
            metaTitle: 'आसान सुडोकू — शुरुआती के लिए (नया खिलाड़ी), ऑनलाइन फ्री',
            metaDescription:
                '37 क्लू वाली मुफ़्त शुरुआती सुडोकू पहेलियाँ, जो सिर्फ़ अंतिम खाली कोशिका और खुले एकल से हल होती हैं। ऑनलाइन खेलें, बिना विज्ञापन और साइन-अप के।'
        },
        id: {
            title: 'Sudoku Pemula',
            headline: 'Sudoku Pemula: Main Sudoku Mudah untuk Belajar',
            metaTitle: 'Sudoku Pemula: Main Sudoku Online Gratis',
            metaDescription:
                'Sudoku pemula gratis dengan 37 angka awal, dijamin selesai hanya dengan sel kosong terakhir dan tunggal telanjang. Main sudoku online tanpa iklan, tanpa daftar.'
        },
        'pt-BR': {
            title: 'Sudoku Iniciante',
            headline: 'Sudoku para Iniciantes (Nível Iniciante)',
            metaTitle: 'Sudoku iniciante: jogar sudoku online grátis',
            metaDescription:
                'Sudokus para iniciantes grátis, com 37 pistas e solução garantida só com última célula livre e único nu. Jogue online, sem anúncios e sem cadastro.'
        },
        sv: {
            title: 'Sudoku för nybörjare',
            headline: 'Lätt sudoku för nybörjare – spela gratis',
            metaTitle: 'Lätt sudoku för nybörjare – spela gratis online',
            metaDescription:
                'Gratis lätt sudoku för nybörjare med 37 givna siffror, garanterat lösbart enbart med sista lediga rutan och nakna singlar. Spela online, utan reklam.'
        },
        uk: {
            title: 'Судоку «Новачок»',
            headline: 'Судоку для початківців (рівень «Новачок»)',
            metaTitle: 'Судоку для початківців — грати онлайн безкоштовно',
            metaDescription:
                'Безкоштовне судоку для початківців із 37 підказками, що гарантовано розв’язується лише «останніми клітинками» та відкритими одинаками. Без реклами й реєстрації.'
        },
        ur: {
            title: 'نیا کھلاڑی سوڈوکو',
            headline: 'ابتدائی سوڈوکو پزلز (نیا کھلاڑی درجہ)',
            metaTitle: 'ابتدائی سوڈوکو (نیا کھلاڑی) — آن لائن مفت پزلز',
            metaDescription:
                '37 کلیوز والے مفت ابتدائی سوڈوکو پزلز، جو صرف آخری خالی خانوں اور کھلے اکہروں سے حل ہونے کی ضمانت رکھتے ہیں۔ بغیر اشتہارات اور سائن اپ کے آن لائن کھیلیں۔'
        },
        zh: {
            title: '新手数独',
            headline: '新手数独：适合入门的简单数独',
            metaTitle: '新手数独在线玩：免费入门数独',
            metaDescription: '免费新手数独，37 个已知数字，只用最后余格和显性单数即可解出。在线玩新手级数独，无广告，无需注册。'
        }
    }
};
