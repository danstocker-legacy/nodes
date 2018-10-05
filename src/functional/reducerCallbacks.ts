export function push(current: Array<any>, next: any): Array<any> {
  current.push(next);
  return current;
}

export function unshift(current: Array<any>, next: any): Array<any> {
  current.unshift(next);
  return current;
}

export function concat(current: Array<any>, next: Array<any>): Array<any> {
  return current.concat(next);
}

export function last(current: any, next: any): any {
  return next;
}

export function join(current: string, next: string): string {
  return current + next;
}

export function sum(current: number, next: number): number {
  return current + next;
}

export function min(current: number, next: number): number {
  return next < current ? next : current;
}

export function max(current: number, next: number): number {
  return next > current ? next : current;
}

export function merge(current: object, next: object): object {
  const keys = Object.keys(next);
  const keyCount = keys.length;
  for (let i = 0; i < keyCount; i++) {
    const key = keys[i];
    current[key] = next[key];
  }
  return current;
}
