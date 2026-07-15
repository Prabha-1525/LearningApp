import type {Brand} from '@shared/types';

/**
 * Canonical module identifiers.
 * Adding a subject = add a const here + register the feature.
 */
export const ModuleId = {
  Chess: 'chess',
  Math: 'math',
  English: 'english',
  Tamil: 'tamil',
  Science: 'science',
  Memory: 'memory',
  Drawing: 'drawing',
} as const;

export type ModuleId = (typeof ModuleId)[keyof typeof ModuleId];

export type ChildId = Brand<string, 'ChildId'>;
export type ParentId = Brand<string, 'ParentId'>;
export type LessonId = Brand<string, 'LessonId'>;

export function asChildId(value: string): ChildId {
  return value as ChildId;
}

export function asParentId(value: string): ParentId {
  return value as ParentId;
}

export function asLessonId(value: string): LessonId {
  return value as LessonId;
}

export function isModuleId(value: string): value is ModuleId {
  return (Object.values(ModuleId) as string[]).includes(value);
}
