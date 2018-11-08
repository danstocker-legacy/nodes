import {Node} from "../node";
import {
  IInPort,
  StaticInPort,
  StaticOutPort,
  TStaticInPorts,
  TStaticOutPorts
} from "../port";
import {THash} from "../utils";
import {TMuxed} from "./TMuxed";

export class Muxer<T extends THash = THash> extends Node {
  public readonly in: TStaticInPorts<T>;
  public readonly out: TStaticOutPorts<{
    $: TMuxed<T>
  }>;

  constructor(fields: Array<string>) {
    super();
    for (const field of fields) {
      this.addPort(new StaticInPort(field, this));
    }
    this.addPort(new StaticOutPort("$", this));
  }

  public send<U extends T[keyof T]>(port: IInPort<U>, input: U, tag?: string): void {
    const name = port.name;
    if (port === this.in[name]) {
      this.out.$.send({name, value: input}, tag);
    }
  }
}
