export const motion = {
  press: 100,
  enter: 320,
  sheet: 280,
  starPop: 400,
  rewardMax: 2500,
  shake: 300,
} as const;

export const motionScale = {
  pressed: 0.96,
  starPop: 1.12,
} as const;

export type MotionToken = typeof motion;
