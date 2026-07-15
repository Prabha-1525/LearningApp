/**
 * TanStack Query keys / hooks for remote chess catalog — deferred.
 */
export const chessQueryKeys = {
  all: ['chess'] as const,
  lessons: () => [...chessQueryKeys.all, 'lessons'] as const,
  lesson: (id: string) => [...chessQueryKeys.lessons(), id] as const,
} as const;
