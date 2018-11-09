import {Node} from "../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../port";
import {THash} from "../utils";
import {TMuxed} from "./TMuxed";

export class Demuxer<T extends THash = THash> extends Node {
  public readonly in: TInPorts<{
    $: TMuxed<T>
  }>;
  public readonly out: TOutPorts<T>;

  constructor(fields: Array<string>) {
    super();
    this.addPort(new InPort("$", this));
    for (const field of fields) {
      this.addPort(new OutPort(field, this));
    }
  }

  public send<U>(port: IInPort<U & TMuxed<T>>, input: U & TMuxed<T>, tag?: string): void {
    if (port === this.in.$) {
      const name = input.name;
      this.out[name].send(input.value, tag);
    }
  }
}
