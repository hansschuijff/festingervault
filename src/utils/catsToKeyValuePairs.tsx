import capitalizeHyphenatedWords from "@/utils/capitalizeHyphenatedWords";

export default function catsToKeyValuePairs(cats: string[]) {
	return cats.map(cat => ({
		label: capitalizeHyphenatedWords(cat),
		value: cat,
	}));
}
