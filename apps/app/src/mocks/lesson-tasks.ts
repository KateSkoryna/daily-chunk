import type { NativeLanguage } from '@daily-chunk/languages';

type Localised = Record<NativeLanguage, string>;

export type MockStoryQuestion = {
  question: string;
  answer: string;
  wrongAnswers: [string, string];
};

export type MockStory = {
  text: string;
  highlightedWords: string[];
  translations: Localised;
  questions: MockStoryQuestion[];
};

export const derLetzteZug = {
  text: 'Anna wartet seit einer halben Stunde am Bahnhof, weil ihr Zug verspätet ist. Auf der Anzeigetafel steht, dass er erst um 18:40 Uhr ankommen soll. Während sie wartet, sucht sie in ihrer Tasche nach der Fahrkarte, die sie im Internet gekauft hat. Sie hat 29 Euro dafür bezahlt, obwohl sie gehofft hatte, dass sie weniger kosten würde. Endlich wird durchgesagt, dass der Zug nach Berlin von Gleis drei abfahren wird. Anna läuft so schnell sie kann die Treppe hinunter, denn sie möchte ihn auf keinen Fall verpassen. Als sie einsteigt, lacht sie erleichtert.',
  highlightedWords: ['Bahnhof', 'verspätet', 'Fahrkarte', 'Gleis'],
  translations: {
    ru: 'Анна ждёт на вокзале уже полчаса, потому что её поезд опаздывает. На табло написано, что он прибудет только в 18:40. Пока она ждёт, она ищет в сумке билет, который купила в интернете. Она заплатила за него 29 евро, хотя надеялась, что он будет стоить дешевле. Наконец объявляют, что поезд на Берлин отправится с пути три. Анна бежит вниз по лестнице так быстро, как может, ведь она ни в коем случае не хочет его пропустить. Когда она садится, она облегчённо смеётся.',
    en: 'Anna has been waiting at the station for half an hour because her train is late. The board says it is only due at 18:40. While she waits, she looks in her bag for the ticket she bought on the internet. She paid 29 euros for it, although she had hoped it would cost less. Finally it is announced that the train to Berlin will leave from platform three. Anna runs down the stairs as fast as she can, because she does not want to miss it at any cost. When she gets on, she laughs with relief.',
  },
  questions: [
    {
      question: 'Wie lange wartet Anna schon?',
      answer: 'eine halbe Stunde',
      wrongAnswers: ['eine Stunde', 'zehn Minuten'],
    },
    {
      question: 'Wann soll der Zug ankommen?',
      answer: '18:40 Uhr',
      wrongAnswers: ['18:04 Uhr', '16:40 Uhr'],
    },
    {
      question: 'Wo hat Anna die Fahrkarte gekauft?',
      answer: 'im Internet',
      wrongAnswers: ['am Schalter', 'im Zug'],
    },
    {
      question: 'Wie viel hat die Fahrkarte gekostet?',
      answer: '29 Euro',
      wrongAnswers: ['19 Euro', '39 Euro'],
    },
    {
      question: 'Von welchem Gleis fährt der Zug nach Berlin ab?',
      answer: 'Gleis drei',
      wrongAnswers: ['Gleis acht', 'Gleis zwei'],
    },
  ],
} satisfies MockStory;

export const readAloudResult = {
  durationSeconds: 24,
  scorePercent: 86,
  verdict: 'clear' as 'clear' | 'almost' | 'unclear',
  retryWords: ['Fahrkarte', 'läuft'],
  pronunciationTips: {
    ru: '«äu» звучит как «ой» в слове «бой»: ЛОЙФТ.',
    en: '"äu" sounds like "oy" in "boy": LOYFT.',
  } satisfies Localised,
};

export const translateTask = {
  prompt: {
    ru: 'Мой поезд опаздывает, я жду на вокзале.',
    en: 'My train is late, I am waiting at the station.',
  } satisfies Localised,
  wordIdsToUse: ['word-bahnhof', 'word-verspaetet'],
  attempt: 'Mein Zug ist verspätet, ich warte in Bahnhof.',
  correction: {
    wrongWord: 'in',
    rightWord: 'am',
    corrected: 'Mein Zug ist verspätet, ich warte am Bahnhof.',
    explanation: {
      ru: '«Warten am Bahnhof» = на вокзале. an + dem = am, потому что der Bahnhof.',
      en: '"Warten am Bahnhof" = at the station. an + dem = am, because der Bahnhof.',
    } satisfies Localised,
  },
};
