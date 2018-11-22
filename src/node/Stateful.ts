import {IStateful} from "./IStateful";

export namespace Stateful {
  export function init(this: IStateful) {
    this.change = {};
  }
}
