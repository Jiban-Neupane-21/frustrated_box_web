import { Confession } from "./types";
import { BULK_CONFESSIONS } from "./mockConfessionsBulk";

const BASE_CONFESSIONS: Confession[] = [
  // ... tapaiko 22 ota existing confession
];

export const MOCK_CONFESSIONS: Confession[] = [
  ...BASE_CONFESSIONS,
  ...BULK_CONFESSIONS,
];
