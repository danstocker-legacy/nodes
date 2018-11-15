import {OutPort} from "../port";
import {IErrorable} from "./IErrorable";

export namespace Errorable {
  export function init(this: IErrorable): void {
    this.svc.err = new OutPort("err", this);
  }
}
