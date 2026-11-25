# Word fields

The Home screen collects today's words in separate one-line fields, one word in each. Three fields are there at the start, and the button "+ Add a word" adds more up to `maxWordsPerLesson` (6, `packages/core/src/start-lesson.ts`).

## How it behaves

- Enter moves to the next field, and adds a field after the last one if there is room.
- A bordered × stands apart on the right of a field when there is something to delete: the field has text, or it is an extra field beyond the first three. It removes an extra field and only clears a required one.
- A pasted list is spread over the following fields (empty ones first, then new ones, up to 6). Duplicates are skipped. A typed word with a space (`sich freuen`) stays in one field.
- The counter under the fields counts the filled, different words. `startLesson` takes at most 6 words and only the room left in an open lesson.

## Where it lives

- `apps/app/src/lib/word-fields.ts`: the pure rules, unit tests in `apps/app/tests/word-fields.test.ts`.
- `apps/app/src/components/WordFields/`: the controlled component. The texts live in the Home route; the component only reports changes.
- Browsers remove line breaks when you paste into a one-line field, so a paste is detected by its size (more than one character at once) and then split on spaces too.
