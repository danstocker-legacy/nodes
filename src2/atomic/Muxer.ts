import {Node} from "../node";
import {IInPort, InPort, OutPort, TInPorts, TOutPorts} from "../port";
import {THash} from "../utils";
import {TMuxed} from "./TMuxed";

export class Muxer<T extends THash = THash> extends Node {
  public readonly in: TInPorts<T>;
  public readonly out: TOutPorts<{
    $: TMuxed<T>
  }>;

  constructor(fields: Array<string>) {
    super();
    for (const field of fields) {
      this.addPort(new InPort(field, this));
    }
    this.addPort(new OutPort("$", this));
  }

  public send<U extends T[keyof T]>(port: IInPort<U>, input: U, tag?: string): void {
    const name = port.name;
    if (port === this.in[name]) {
      this.out.$.send({name, value: input}, tag);
    }
  }
}
