# AI service and its mocks

**What:** `AiService` in `packages/core/src/ai.ts` is the list of everything the app asks an AI to do: normalise typed words, write a story, make gap sentences, check a translation, score pronunciation. Each call takes a request and returns a Promise of a response.

**Language pair on every call:** every request extends `AiRequest` (`{ languages: { targetLanguage, nativeLanguage } }`). A response carries text in one native language only (for example `translation: string`), never one field per language.

**Mocks:** `createMockAiService()` in `apps/app/src/ai/mock-ai-service.ts` implements the same type with the demo content from `src/mocks/` (Bahnhof, Fahrkarte, verspätet, Gleis; "Der letzte Zug"). It knows only the demo words and answers the demo translation. The screens depend on the `AiService` type, so in phase 5 the Edge Functions replace the mock without touching a screen.

**Limits of the mock:** it ignores `targetLanguage` and the `words` it is given; `normaliseWords` matches only the four demo lemmas or their plural forms; `checkTranslation` ignores `prompt`, so any attempt except the exact corrected sentence gets the same "in / am" correction. `wasPluralised` means "the typed text was a plural turned into the singular" and the real function must mean the same.

**Why:** the app works offline and in tests with no backend, and the request and response shapes are fixed before Gemini exists.

**Tests:** type tests in `packages/core/src/types.test.ts`; behaviour in `apps/app/tests/mock-ai-service.test.ts`.
