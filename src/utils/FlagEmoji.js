export function flagEmoji(countryCode) {
  if (countryCode == "UK") {
    countryCode = "gb";
  }
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}