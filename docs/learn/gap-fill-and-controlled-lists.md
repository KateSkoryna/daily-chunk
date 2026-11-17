# Gap fill, tiles and the record button

## The screen owns the lists

`OptionGrid` and `SentenceBuilder` hold no state. You give them the options, the chosen value or the two lists of tiles, and they tell you what was pressed (`onSelect`, `onAdd`, `onRemove`). The screen decides what a press means: add a tile, check an answer, count a mistake. That is why the same grid can pick an article answer, a word, or a daily goal.

## Answered states are inputs, not memory

`OptionGrid` locks itself when you give it `correctAnswer`. Nothing inside it remembers "I was checked": no `correctAnswer` means open, a `correctAnswer` means show the result. The result is told three ways, never by colour alone: a check or cross icon, a dashed border on the answer you missed, and colour.

## Why a group, not a list

An accessibility checker complains if you name a plain `div` (`aria-label`) or call something a `list` without list items inside. The blank and the answer line are real things people need names for, so they are `role="group"`: a named box that screen readers announce as a group.

## The record button

Three states, one component: the icon and the fill change, the size does not. The timer and the score are text next to the button, so a screen reader reads them as text and the button only has to say what a press does now ("Stop recording"). Recording audio is the one job that gets a round button, so keep `rounded-full` for it only.
