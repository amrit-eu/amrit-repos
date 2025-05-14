import { createHighlighter } from 'shiki';

let cachedHighlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

export const highlightCode = async (code: string, lang: string = 'turtle') => {
  if (!cachedHighlighter) {
    cachedHighlighter = await createHighlighter({
      themes: ['github-dark'],
      langs: ['turtle', 'json'],
    });
  }
  return cachedHighlighter.codeToHtml(code, {
    lang,
    theme: 'github-dark',
  });
};
