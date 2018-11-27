type TFunction = (...arg) => any;

const functions: Map<string, TFunction> = new Map();

/**
 * Stores functions by their string representations.
 */
export class FunctionStore {
  public static clear() {
    functions.clear();
  }

  public static get(body: string): TFunction {
    if (functions.has(body)) {
      return functions.get(body);
    } else {
      // tslint:disable:no-eval
      const fn = eval(`(${body})`);
      // tslint:enable:no-eval
      functions.set(body, fn);
      return fn;
    }
  }
}
