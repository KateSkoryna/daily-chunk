# App chrome: bars, tiles and tabs

## Controlled again

`TabBar` does not know about screens. You give it the tabs, the active key and an `onSelect`; the navigation shell (step 3.1) maps a key to a route. That is why it can be tested in Storybook without a router.

## Slots, not options

`TopBar` has a `left` and a `right` slot. A screen puts a menu button on the left and `HeaderStats` on the right, or a close button and a counter. One component, no `showMenu` and `showStats` flags.

## A bordered box is wider than an unbordered one

With `flex-1`, each tile gets the same share of the free space, but a 2px border is added to the share, so an outlined tile ends up 4px wider than a filled one. Wrapping all three tiles the same way (the filled one has the hard shadow, the others have it hidden) gives them equal widths.

## Why a safe-area value is a prop

Phones have a strip at the bottom (the gesture bar) that the tab bar must not sit under. The library that reads it only works on phones, not in the browser Storybook, so the shell reads it and passes it in as `bottomInset`.
