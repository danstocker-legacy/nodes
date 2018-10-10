export const ccb = {
  /**
   * Compares intrinsic values of inputs.
   */
  intrinsic: (a: any, b: any): number => {
    return a > b ? 1 : a < b ? -1 : a === b ? 0 : undefined;
  }
};
