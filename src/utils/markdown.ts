function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function inline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  return out;
}

/**
 * Minimal markdown renderer for short editorial bodies stored in frontmatter:
 * paragraphs, unordered lists, bold, italic, inline code and links.
 */
export function renderMarkdown(markdown: string | undefined | null): string {
  if (!markdown) return '';

  const blocks = markdown.trim().split(/\n{2,}/);
  const html: string[] = [];

  for (const block of blocks) {
    const lines = block
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) continue;

    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      const items = lines
        .map((line) => `<li>${inline(line.replace(/^[-*]\s+/, ''))}</li>`)
        .join('');
      html.push(`<ul>${items}</ul>`);
      continue;
    }

    html.push(`<p>${inline(lines.join(' '))}</p>`);
  }

  return html.join('\n');
}
