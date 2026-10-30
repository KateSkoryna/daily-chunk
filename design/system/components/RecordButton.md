# RecordButton

Starts and stops the read-aloud recording and plays it back with the AI pronunciation score.

- 80×80 circle (`radius-round`, the only round control), 3px border.
- States: idle = `pink` outline + mic; recording = `pink` fill + stop square + timer `● 00:24`; done = `cyan` outline + play + score ("92% CLEAR").
- After the check, words to retry are underlined in `pink` in the story text; tap a word to hear the model and retry that word only.
- Also used for shadowing (Step 2), at 64×64.
