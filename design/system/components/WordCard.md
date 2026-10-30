# WordCard

The flashcard: front shows the noun with article, back shows plural, Russian, and an example.

- Size: 342×360 mobile, 420×420 desktop; padding `space-6`; `bg-100` (back: `bg-200`); 2px `line` border; `shadow-hard`.
- Front: ArticleChip tag top, word in `word-xl` (includes the article), footer with hint + 48px audio button (cyan outline).
- Back: plural in `word-l` + "PL." caption; RU in `body` `ink-muted`; example DE in `body` `ink` with RU below.
- Gestures: tap = flip (`dur-flip`), swipe right = knew it, left = again. Desktop: Space, →, ←.
- Non-nouns (verbs, adjectives) skip the chip and show infinitive / base form + forms line (ging → gehen, ging, gegangen).
