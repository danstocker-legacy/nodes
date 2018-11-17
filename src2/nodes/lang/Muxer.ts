import {
  EventSource,
  IEventSource,
  ISink,
  ISource,
  Serviced,
  Sink,
  Source
} from "../../node";
import {
  IInPort,
  InPort,
  OutPort,
  TEventPorts,
  TInPorts,
  TOutPorts
} from "../../port";
import {IAnything, IMuxed} from "../../utils";

/**
 * Multiplexes inputs.
 * Channels impulses from all input ports into a single output port,
 * adding the input port's name.
 * @example
 * let muxer: Muxer<{foo: number, bar: boolean}>;
 * muxer = new Muxer(["foo", "bar"]);
 * muxer.in.foo.send(5);
 * // outputs `{val: 5, name: "foo"}` on port "$"
 */
export class Muxer<T extends IAnything = IAnything>
  implements ISink, ISource, IEventSource {
  public readonly in: TInPorts<T>;
  public readonly out: TOutPorts<{
    $: IMuxed<T>;
  }>;
  public readonly svc: TEventPorts<Sink.TEventTypes | Source.TEventTypes>;

  constructor(fields: Array<string>) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    for (const field of fields) {
      this.in[field] = new InPort(field, this);
    }
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<T[keyof T]>, input: T[keyof T], tag?: string): void {
    const name = port.name;
    if (port === this.in[name]) {
      this.out.$.send({name, val: input}, tag);
    }
  }
}
