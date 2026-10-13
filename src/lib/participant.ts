export function participantKey(firstName: string, lastName: string) {
  return `${firstName} ${lastName}`
    .normalize("NFC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("pt-BR");
}
