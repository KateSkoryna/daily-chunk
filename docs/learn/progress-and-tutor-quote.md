# Progress bars and a label on a border

## A progress bar is a role, not a look

Six coloured boxes in a row look like progress to your eyes. A screen reader sees nothing. `accessibilityRole="progressbar"` on the row tells it "this is progress", and the value (`aria-valuenow` = which step, `aria-valuemax` = how many) tells it where we are. The visible label doubles as the name.

React Native has `accessibilityValue` for the same thing on phones. React Native Web drops it, so the stepper uses the `aria-value*` props, which work on both.

## Done, current, upcoming: derive, don't store

`LessonStepper` stores nothing. Its one input is `current`. For every segment it asks "is my position before, equal to, or after `current`?" and picks a class from a table. The screen owns the real progress.

## A tab that sits on the border

`TutorQuote` is a box with a border. The tab on its top edge is a child placed with `absolute` and a negative `top`, so half of it sticks out over the border line. The box gets extra top padding so the text underneath doesn't run into the tab.

## Colour is never the only signal

Pass and fail change the colour, but each also gets an icon (check or cross) and its own tab text. Someone who can't tell green from red still reads "approves" and sees the check.
