import { decodeEntities } from "@wordpress/html-entities";

export default function catsToKeyValuePairs(cats: Record<string, string>) {
  return Object.entries(cats).map(([key, value]) => ({
    label: decodeEntities(value),
    value: key,
  }));
}
