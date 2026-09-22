// Whitespace becomes a hyphen before the character filter runs, so punctuation next to a space
// still leaves a separator behind ('Hello, World' -> 'hello,-world' -> 'hello-world').
export function slugify(text: string): string {
 return text.toLowerCase()
  .replace(/\s+/g,'-')
  .replace(/[^\p{L}\p{Nd}-]/gu,'')
  .replace(/-+/g,'-')
  .replace(/^-|-$/g,'');
}
