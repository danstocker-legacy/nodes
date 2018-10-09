/**
 * Determines equality by reference.
 */
export function reference<T>(a: T, b: T): boolean {
  return a === b;
}

// TODO: Add shallow(), deep()
