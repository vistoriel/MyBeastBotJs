/**
 * Calculate count of beast experience by provided `level`.
 */
export function calcBeastExperience(level: number): number {
  return Math.pow(100, level * 0.1) * 3;
}

/**
 * Calculate beast level by provided `experience`.
 */
export function calcBeastLevel(experience: number): number {
  let level = 1;
  let mxp = 0;

  while (true) {
    mxp = calcBeastExperience(level);
    if (mxp >= experience) {
      level -= 1;
      break;
    }

    level += 1;
  }

  return level;
}
