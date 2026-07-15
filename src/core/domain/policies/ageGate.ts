import {TARGET_AGE_MAX, TARGET_AGE_MIN, type ChildProfile} from '../entities';

export type AgeGateResult =
  | {readonly allowed: true}
  | {readonly allowed: false; readonly reason: 'below_min' | 'above_max'};

/**
 * Product targets ages 5–8. Soft gate for profile creation / module eligibility.
 */
export function evaluateAgeGate(ageYears: number): AgeGateResult {
  if (ageYears < TARGET_AGE_MIN) {
    return {allowed: false, reason: 'below_min'};
  }
  if (ageYears > TARGET_AGE_MAX) {
    return {allowed: false, reason: 'above_max'};
  }
  return {allowed: true};
}

export function isChildInTargetAgeRange(profile: ChildProfile): boolean {
  return evaluateAgeGate(profile.ageYears).allowed;
}

export function isAgeEligibleForModule(
  ageYears: number,
  minAge: number,
  maxAge: number,
): boolean {
  return ageYears >= minAge && ageYears <= maxAge;
}
