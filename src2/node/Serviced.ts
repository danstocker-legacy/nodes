import {TOutPorts} from "../port";
import {IServiced} from "./IServiced";

export class Serviced<T> implements IServiced<T> {
  public readonly svc: TOutPorts<T>;

  constructor() {
    this.svc = <TOutPorts<T>> {};
  }
}
