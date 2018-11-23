import {IStateful} from "./IStateful";

export namespace MStateful {
  export function init(this: IStateful) {
    this.change = {};
  }
}
