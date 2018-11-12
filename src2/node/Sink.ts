import {IInPort, TInPorts} from "../port";
import {ISink} from "./ISink";

export class Sink<T> implements ISink<T> {
  public readonly in: TInPorts<T>;

  constructor() {
    this.in = <TInPorts<T>> {};
  }

  public send(port: IInPort<T[keyof T]>, value: T[keyof T], tag?: string): void {
    //
  }
}
