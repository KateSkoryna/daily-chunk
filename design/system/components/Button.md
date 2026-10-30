# Button

Three levels of action: one yellow primary per screen, cyan secondary, text-only ghost.

| Variant | Size | Fill / border | Label |
| --- | --- | --- | --- |
| primary | 64px high, full width on mobile (342px), max 360px on desktop | `yellow`, `shadow-hard` | `display-btn`, `ink-inverse`, uppercase |
| primary pressed | same | translate(4px,4px), no shadow | |
| primary disabled | same | `bg-200`, no shadow | `ink-muted` |
| secondary | 56px high, padding 0 20px | transparent, 2px `cyan` border | Bungee 16px `cyan` |
| ghost | 48px high | none | `label` style, `ink-muted` |

Rules: never two primaries on a screen; minimum target 48×48; focus ring `focus` 2px offset 2px.
