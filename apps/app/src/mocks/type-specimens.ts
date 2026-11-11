import type { AppLanguage } from '@daily-chunk/i18n';

import type { TextVariant } from '../components/tokens';

export const typeSpecimens = {
  en: {
    'display-xl': 'Daily Chunk',
    'display-l': 'Lektion 12',
    'display-num': '1240 XP',
    'display-btn': 'Start lesson',
    'display-btn-sm': 'Next',
    label: '01 / Flashcards',
    'label-sm': '03 / Read the story',
    ui: '5 words due today',
    caption: 'Tap to flip',
    'word-xl': 'der Bahnhof',
    'word-l': 'die Bahnhöfe',
    option: 'des Bahnhofs',
    chip: 'der',
    reading: 'Am Bahnhof wartet …',
    body: 'He is waiting for the train at the station.',
    'body-sm': 'station (m.)',
  },
  ru: {
    'display-xl': 'Съешь ещё',
    'display-l': 'Урок 12',
    'display-num': '1240',
    'display-btn': 'Начать урок',
    'display-btn-sm': 'Далее',
    label: '01 / Карточки',
    'label-sm': '03 / Читать историю',
    ui: 'На сегодня 5 слов',
    caption: 'Нажми, чтобы перевернуть',
    'word-xl': 'der Bahnhof',
    'word-l': 'die Bahnhöfe',
    option: 'des Bahnhofs',
    chip: 'der',
    reading: 'Am Bahnhof wartet …',
    body: 'Он ждёт поезд на вокзале.',
    'body-sm': 'вокзал (м.)',
  },
} satisfies Record<AppLanguage, Record<TextVariant, string>>;
