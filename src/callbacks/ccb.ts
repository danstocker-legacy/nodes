export const ccb = {
  /**
   * Compares reference values of inputs.
   */
  reference: (a: any, b: any): number => {
    return a > b ? 1 : a < b ? -1 : a === b ? 0 : undefined;
  }
};
