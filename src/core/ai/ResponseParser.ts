import {safetyFilter} from './SafetyFilter';

/**
 * Normalizes raw LLM output into short child-friendly coach lines.
 */
export class ResponseParser {
  parse(raw: string): string {
    const withoutMarkdown = raw
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\*\*/g, '')
      .replace(/^#+\s*/gm, '')
      .trim();

    const firstParagraph =
      withoutMarkdown.split(/\n{2,}/)[0]?.trim() ?? withoutMarkdown;
    const sentences = firstParagraph
      .split(/(?<=[.!?])\s+/)
      .filter(Boolean)
      .slice(0, 2);
    const joined = sentences.join(' ').trim();
    return safetyFilter.sanitize(joined || withoutMarkdown);
  }
}

export const responseParser = new ResponseParser();
