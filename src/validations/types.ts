/**
 * Translator for validation messages. Optional so the same schemas can run
 * on the server (Server Actions) where zod's default messages are enough.
 */
export type Translate = ((key: string) => string) | undefined;
