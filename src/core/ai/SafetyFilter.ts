const BLOCKED_PATTERNS = [
  /\b(kill|murder|suicide|weapon|gun|knife)\b/i,
  /\b(sex|porn|nude)\b/i,
  /\b(hate|racist|slur)\b/i,
];

const MAX_CHILD_RESPONSE_CHARS = 280;

/**
 * Child-safety filter for AI coach responses (ages 5–8).
 */
export class SafetyFilter {
  sanitize(text: string): string {
    const trimmed = text.trim().replace(/\s+/g, ' ');
    if (!trimmed) {
      return '';
    }
    for (const pattern of BLOCKED_PATTERNS) {
      if (pattern.test(trimmed)) {
        return '';
      }
    }
    if (trimmed.length > MAX_CHILD_RESPONSE_CHARS) {
      return `${trimmed.slice(0, MAX_CHILD_RESPONSE_CHARS - 1)}…`;
    }
    return trimmed;
  }

  isEducationalContext(moduleId: string): boolean {
    return (
      moduleId === 'chess' ||
      moduleId === 'math' ||
      moduleId === 'english' ||
      moduleId === 'tamil' ||
      moduleId === 'science' ||
      moduleId === 'general'
    );
  }
}

export const safetyFilter = new SafetyFilter();
