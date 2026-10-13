/**
 * Serialises a value for embedding inside a `<script>` element.
 *
 * `JSON.stringify` alone is not enough: a string containing `</script>` would
 * close the tag early and let the rest of the payload be parsed as HTML. The
 * line and paragraph separators are escaped too, because they are valid inside
 * JSON strings but break JavaScript parsing.
 */
export function safeJsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
