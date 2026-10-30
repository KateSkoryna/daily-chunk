# Daily Wort

A German vocabulary trainer for Russian speakers, in the arcade-night look of Daily Chuck. You drop in the words you heard today; the app finds article, plural and translation, then runs a short lesson built from them. "Daily Wort" is a working title.

## 1. Product in one screen

| Step | What happens | Why in this order |
| --- | --- | --- |
| 0. Add words | Type a list or dictate by voice. Any form is fine: *Bahnhöfe*, *ging*, *schöner*. AI normalises to the dictionary form, adds article, plural and Russian translation; you confirm or fix each row. | Your own words = high relevance, better retention. |
| 1. Flashcards | Front: word with article in its colour. Back: plural, RU translation, audio, one example sentence. | First meet form + meaning (receptive). |
| 2. Listen & shadow | Native audio of each word, then a short phrase; you repeat right after it. | Sound before reading; trains pronunciation and the article as part of the word. |
| 3. Read the story | A 6–10 sentence text that uses all of today's words, highlighted. Tap a word for the card. | Words in context (comprehensible input). |
| 4. Read aloud & record | Read the same text aloud. AI pronunciation check marks words to retry. | First spoken output, with support. |
| 5. Gap fill | Sentences from the story with blanks; pick or type the word *with* the right article/ending. | Controlled recall. |
| 6. RU → DE | Translate 3–5 Russian sentences into German using today's words. | Free production: hardest, so last. |
| Done | Tutor quote, XP, streak. Words enter spaced repetition. | |

**Review and tests**
- Spaced repetition: a word comes back after 1, 3, 7, 14 and 30 days. Correct at the 30-day review = *learned* (auto, no button).
- **Daily digest**: one push per day at a time you pick, listing due words; tap opens the review.
- **Word of the moment**: optional extra push showing one word + article + translation (no action).
- **Every 5th lesson: Boss round test** covering the last 5 lessons: (a) RU word → type German, (b) choose the right word from 3, (c) build a sentence from shuffled tiles.

**Tutor**
- Persona picked in Settings (e.g. strict ranger, playful sheriff, calm captain; all original characters).
- Speaks only in short lines: a motivation line at lesson start, a quote or joke after pass/fail, encouragement on a streak. Never a full chat.

## 2. Screen inventory

| # | Screen | Mobile (390×844) | Desktop (1440×900) |
| --- | --- | --- | --- |
| S1 | Home = Add words | Title, tutor line, big text area with mic, list of parsed words, **START LESSON**. Above: streak, XP, "Test in 2 lessons" bar. | Rail left; center column 720px add-words; right column 360px: due today, streak, next test. |
| S2 | Confirm words | Rows: chip + word + plural + RU, editable; delete swipes. | Same, as a table. |
| S3–S8 | Lesson tasks 1–6 | Top: back, LessonStepper (6 segments). One task per screen, primary button bottom. | Task in 720px column, stepper on top, tutor line to the right. |
| S9 | Lesson done | Tutor quote, XP count-up, words added to review. | Same, centered card 560px. |
| S10 | Review (due words) | Flashcards, swipe right = knew it, left = again. | Card + keyboard: → knew, ← again, Space flip. |
| S11 | Word bank | Filter: new / learning / learned; search; article filter chips. | 3-column card grid. |
| S12 | Boss round test | 3 parts, score at the end. | Same, 720px column. |
| S13 | Settings | Tutor persona, digest time, word-of-the-moment on/off, voice for audio. | Same. |

Navigation: mobile bottom TabBar with **WORDS · LEARN · REVIEW · ME**; desktop ≥1024px the same four items in a 240px left rail.

## 3. Visual foundations

- **Ground**: always `bg-000` with a faint scanline overlay. Cards `bg-100`, raised `bg-200`. Dark only (one theme).
- **Square everything**: `radius-0`. Depth comes from hard offset shadows (`shadow-hard`), never blur.
- **Colour has jobs**: `yellow` = the one primary action, `cyan` = focus, input borders and *correct*, `pink` = section labels, record and *wrong*. Correct/wrong always carry an icon (✓ / ✗), never colour alone.
- **Article colours** are the learning code: `article-der` blue, `article-die` red, `article-das` green, `article-plural` orange as a *dashed outline*. They always appear with the article word written out, so colour is a reinforcement, not the only cue.
- **Three faces, three jobs**:
  - `display` Bungee: titles, buttons, numbers. Latin only, unicase, so never for German nouns or Russian.
  - `pixel` VT323: labels and short UI copy; Cyrillic falls back to Pixelify Sans.
  - `content` IBM Plex Sans: every German word, sentence and Russian translation. Learning text must be readable and keep noun capitalisation.
- **Grid**: 4px. Mobile gutter `space-6` (24px), top padding `space-14` (56px), section gap `space-5` (20px). Touch targets `size-touch` 48px minimum.

### Layout specs

**Mobile (base, 390 wide)**: padding 56 24 16; content column = 342px; primary button full width, 64px high, pinned above the tab bar; tab bar 56px + safe-area inset.

**Tablet (≥600)**: gutter 32px; lesson column centered, max `size-content` 720px; tab bar stays.

**Desktop (≥1024)**: left rail `size-rail` 240px (bg-100, right border `line`); page max `size-page` 1200px; 12-column grid, 24px gap. Home: 8 columns add-words + 4 columns side panel. Lesson: 720px column centered in the remaining space. Display-xl grows to 64px, display-l to 44px.

## 4. Content and voice

- UI language: English or Russian (user choice); learning content: German with Russian help.
- Labels uppercase in `pixel`, numbered like a game: `01 / FLASHCARDS`, `02 / LISTEN`.
- Tutor lines: max 2 short sentences, second person, dry humour. Examples: "Der Bahnhof. DER. Say it like you mean it." / "Three wrong? Good. Now you know which ones to hunt."
- Errors are never scolding: show the right answer, the article in colour, and move on.

## 5. Iconography

Inline stroke SVG, 24×24 viewBox, stroke 2px, square caps, `currentColor`. Set: play, mic, stop, back chevron, check, cross, flip, speaker, plus, search. No emoji.

## 6. Accessibility rules

- Text contrast ≥4.5:1 on every surface (all ink tokens pass on bg-000/100/200; `line` is decorative only, use `line-strong` for control borders).
- Focus: 2px `focus` outline, 2px offset.
- Reduced motion: no flip animation, no XP count-up.
- Recording and audio always have a text alternative (transcript, written word).
