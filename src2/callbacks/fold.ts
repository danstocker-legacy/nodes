/**
 * Frequently used Folder callbacks.
 */
export namespace fold {
  /**
   * Pushes next item onto the output array.
   */
  export function push(curr: Array<any>, next: any): Array<any> {
    curr.push(next);
    return curr;
  }

  /**
   * Unshifts next item onto the output array.
   */
  export function unshift(curr: Array<any>, next: any): Array<any> {
    curr.unshift(next);
    return curr;
  }

  /**
   * Concatenates next array item to output array.
   * @param curr
   * @param next
   */
  export function concat(curr: Array<any>, next: Array<any>): Array<any> {
    return curr.concat(next);
  }

  /**
   * Keeps last of items as output.
   */
  export function last(curr: any, next: any): any {
    return next;
  }

  /**
   * Joins strings into output string.
   */
  export function join(curr: string, next: string): string {
    return curr + next;
  }

  /**
   * Sums numbers.
   */
  export function sum(curr: number, next: number): number {
    return curr + next;
  }

  /**
   * Outputs minimum of items.
   */
  export function min(curr: number, next: number): number {
    return next < curr ? next : curr;
  }

  /**
   * Outputs maximum of items.
   */
  export function max(curr: number, next: number): number {
    return next > curr ? next : curr;
  }
}
