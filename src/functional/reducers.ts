export namespace reducers {
  export function array<I>(result: Array<I>, next: I) {
    result.push(next);
    return result;
  }

  export function sum(result: number, next: number) {
    return result + next;
  }
}
