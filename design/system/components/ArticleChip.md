# ArticleChip

Shows or asks for a noun's grammatical gender; the article word is always written, colour reinforces it.

- **Tag**: 32px high, padding 0 10px, `radius-0`, IBM Plex Sans 600 16px, `ink-inverse` on `article-der` / `article-die` / `article-das`.
- **Plural tag**: transparent, 2px dashed `article-plural` border, text `article-plural`, label "die · Pl.".
- **Picker** (der/die/das quiz, notification quick answer): 48px high, min 72px wide, `bg-100` + 2px `line-strong` border; selected = article fill. After answering, correct = cyan border + ✓, wrong = pink border + ✗ and the right chip filled.
- Same colours everywhere: word underline in reading text (3px), flashcard left edge is NOT used (no left-border cards) — use the chip.
