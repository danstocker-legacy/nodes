/**
 * Collection of comparison callbacks.
 */
export namespace compare {
  /**
   * Compares reference values of inputs.
   */
  export function reference(a: any, b: any): number {
    return a > b ? 1 : a < b ? -1 : a === b ? 0 : undefined;
  }
}
