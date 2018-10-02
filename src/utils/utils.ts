export function shallowCopy(a: any): any {
  if (a instanceof Array) {
    return a.slice();
  } else if (a instanceof Object) {
    const result = {};
    const keys = Object.keys(a);
    const keyCount = keys.length;
    for (let i = 0; i < keyCount; i++) {
      const key = keys[i];
      result[key] = a[key];
    }
    return result;
  } else {
    return a;
  }
}
