import {IAny} from "./IAny";
import {TJsonPath} from "./TJsonPath";

export class Tree {
  /**
   * Retrieves value from the specified path of the specified container object.
   * @param tree
   * @param path
   */
  public static get(
    tree: IAny,
    path: TJsonPath
  ): any {
    for (const key of path) {
      if (tree[key] === undefined) {
        return undefined;
      } else {
        tree = tree[key];
      }
    }
    return tree;
  }

  /**
   * Sets value at the specified path of the specified container object.
   * @param tree
   * @param path
   * @param value
   */
  public static set(
    tree: IAny,
    path: TJsonPath,
    value: any
  ): void {
    const temp = path.slice();
    const lastKey = temp.pop();
    for (const key of temp) {
      if (!(tree[key] instanceof Object)) {
        tree[key] = {};
      }
      tree = tree[key];
    }
    tree[lastKey] = value;
  }
}
