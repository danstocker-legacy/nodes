import {TUnfolderCallback} from "../nodes/lang/Unfolder";

/**
 * Frequently used Unfolder callbacks.
 */
export namespace unfold {
  /**
   * Returns function which splits string along the specified delimiter,
   * preserving fragments at ends / beginnings of inputs.
   * @example
   * const lineSplitter = new Unfolder(unfold.split$("\n"));
   */
  export function split$(delimiter: string):
    TUnfolderCallback<string, string> {
    const delimiterLength = delimiter.length;
    let fragment = "";
    return (curr: string) => {
      if (fragment) {
        curr = fragment + curr;
      }
      const pos = curr.indexOf(delimiter);
      if (pos !== -1) {
        fragment = "";
        return {
          curr: curr.substr(pos + delimiterLength),
          done: false,
          next: curr.substr(0, pos)
        };
      } else {
        fragment = curr;
        return {
          curr: null,
          done: true,
          next: null
        };
      }
    };
  }
}
