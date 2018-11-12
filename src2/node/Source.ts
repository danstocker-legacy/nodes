import {TOutPorts} from "../port";
import {ISource} from "./ISource";

export class Source<T> implements ISource<T> {
  public readonly out: TOutPorts<T>;

  constructor() {
    this.out = <TOutPorts<T>> {};
  }
}
