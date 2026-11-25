# Lists in React Native

Two ways to show a list: `.map()` inside a view, or `FlatList`.

## `.map()` for short lists

Use `items.map((item) => <Row key={item.id} />)` when the list has a handful of rows, such as the 3 to 6 word fields on Home or the six tasks of a lesson. It renders everything at once, which costs nothing at this size, and it works inside a `Screen` (a `ScrollView`).

## `FlatList` for long lists

`FlatList` renders only the rows near the screen and recycles the rest, so a list of hundreds of rows stays fast. Use it for the Word bank, the review history and the lessons list (phase 4). When a screen is mainly one long list, the `FlatList` is the scrolling view itself, not a child of a `ScrollView`: React Native warns about nesting a `FlatList` inside a `ScrollView` that scrolls the same way. If a list grows big and still feels slow, `FlashList` is a drop-in replacement.

Do not use `FlatList` for text inputs: a row that scrolls out of view is unmounted and loses its focus and text.

## Keys

Every row needs a `key` that stays with the item. The index is fine for a list that never changes order. For a list where rows are removed from the middle, give each item an id and use it as the key (the word fields do: `{ id, text }`), or the typed text and the focus can jump to the neighbour.
