/**
 * Collection of reducer callbacks.
 */
export namespace rcb {
  /**
   * Pushes next item into the output array.
   */
  export function push(current: Array<any>, next: any): Array<any> {
    current.push(next);
    return current;
  }

  /**
   * Unshifts next item into the output array.
   */
  export function unshift(current: Array<any>, next: any): Array<any> {
    current.unshift(next);
    return current;
  }

  /**
   * Concatenates next array item to output array.
   * @param current
   * @param next
   */
  export function concat(current: Array<any>, next: Array<any>): Array<any> {
    return current.concat(next);
  }

  /**
   * Keeps last of items as output.
   */
  export function last(current: any, next: any): any {
    return next;
  }

  /**
   * Joins strings into output string.
   */
  export function join(current: string, next: string): string {
    return current + next;
  }

  /**
   * Sums numbers.
   */
  export function sum(current: number, next: number): number {
    return current + next;
  }

  /**
   * Outputs minimum of inputs.
   */
  export function min(current: number, next: number): number {
    return next < current ? next : current;
  }

  /**
   * Outputs maximum of inputs.
   */
  export function max(current: number, next: number): number {
    return next > current ? next : current;
  }

  /**
   * Merges objects. On collision, key added later wins.
   */
  export function merge(current: object, next: object): object {
    const keys = Object.keys(next);
    const keyCount = keys.length;
    for (let i = 0; i < keyCount; i++) {
      const key = keys[i];
      current[key] = next[key];
    }
    return current;
  }
}
