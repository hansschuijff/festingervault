export default function truncate(string, length=15, end = "...") {
	return string.length < length ? string : string.substring(0, length) + end
}
