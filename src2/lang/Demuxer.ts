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

export class Demuxer<T extends THash = THash> extends Node {
  public readonly in: TStaticInPorts<{
    $: TMuxed<T>
  }>;
  public readonly out: TStaticOutPorts<T>;

  constructor(fields: Array<string>) {
    super();
    this.addPort(new StaticInPort("$", this));
    for (const field of fields) {
      this.addPort(new StaticOutPort(field, this));
    }
  }

  public send<U>(port: IInPort<U & TMuxed<T>>, input: U & TMuxed<T>, tag?: string): void {
    if (port === this.in.$) {
      const name = input.name;
      this.out[name].send(input.value, input.tag);
    }
  }
}
