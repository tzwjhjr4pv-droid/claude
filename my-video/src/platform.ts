/**
 * Welche Variante gerendert wird: Claude (Standard) oder ChatGPT.
 * Umschalten beim Rendern: REMOTION_PLATFORM=chatgpt npx remotion render …
 */
const raw = typeof process !== "undefined" ? process.env.REMOTION_PLATFORM : undefined;
export const IS_GPT = raw === "chatgpt";
export const TOOL = IS_GPT ? "ChatGPT" : "Claude";
/** Text je nach Variante */
export const pick = <T,>(claude: T, chatgpt: T): T => (IS_GPT ? chatgpt : claude);
/** Ordner der Sprachdateien je nach Variante */
export const voiceFolder = (name: string) => (IS_GPT ? `chatgpt-${name}` : name);
