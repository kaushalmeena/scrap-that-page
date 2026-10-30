# Adding a step type

A step type touches every layer. Work through the list in order; the type
checker catches most omissions after step 1.

1. **Stored shape** — add a variant to `zOperation` in
   `src/types/operation.ts` (its inputs tuple: `text`, `select` or
   `block` for nested steps).
2. **Editor metadata** — add an entry to `OPERATION_SCHEMA` in
   `src/constants/operationSchema.ts`: name, description, summary
   `format` (`{0}` = first input), and input definitions with validation rules
   and pickers. The editor derives its fields from this; no editor component
   changes are needed.
3. **Appearance** — add the glyph, tint and library category to
   `OPERATION_APPEARANCE` in `src/lib/operationAppearance.ts`.
4. **Run behavior** — handle the type in `createRunnerGenerator`
   (`features/runner/utils/runnerUtils.ts`):
   - renderer-only steps (variables, control flow) update `variables` and
     yield nothing;
   - browser steps yield a `ScraperOperation`, and also need a log heading in
     `getRunnerHeaderInfo`.
5. **Browser steps only** — add the `ScraperOperation` variant
   (`src/types/scraper.ts`), allow it in `SCRAPER_OPERATION_TYPES`
   (`src/main/proxy/scraper.ts`), execute it in `processOperation`
   (`src/main/utils/scraper.ts`), and implement the action on `Scraper` /
   `DebuggerPage` with auto-waiting.
6. **Tests** — cover the generator output in `runnerUtils.test.ts`, and any
   formatting or validation in `src/utils/operation.test.ts`.

Existing stored scripts stay valid when you add a type. Changing an existing
type's inputs changes the stored shape: bump `SCRIPT_SCHEMA_VERSION` and add a
migration in `parseStoredScript` (`src/database/schema.ts`).
