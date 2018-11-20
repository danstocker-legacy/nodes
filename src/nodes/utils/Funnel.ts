import {
  ErrorSource,
  EventSource,
  IErrorSource,
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
  TErrorPorts,
  TEventPorts,
  TInPorts,
  TOutPorts
} from "../../port";

type TFunnelInputs<P extends string, T> = {
  [K in P]: T
};

/**
 * Forwards inputs from multiple ports to a single output.
 * Outputs which input the value came through.
 * Atomic equivalent of a composite node.
 * Composite view:
 * A -+-> Muxer -> Mapper -> Splitter =#-> $
 * B -+                                +-> case
 * C -+
 * ...
 * @example
 * let funnel: Funnel<"foo" | "bar" | "baz", number>;
 * funnel = new Funnel(["foo", "bar", "baz"]);
 */
export class Funnel<P extends string, T> implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<TFunnelInputs<P, T>>;
  public readonly out: TOutPorts<{
    val: T;
    case: P;
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes>;

  constructor(cases: Array<string>) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    for (const field of cases) {
      this.in[field] = new InPort(field, this);
    }
    this.out.val = new OutPort("val", this);
    this.out.case = new OutPort("case", this);
  }

  public send(
    port: IInPort<TFunnelInputs<P, T>>,
    value: T,
    tag?: string
  ): void {
    this.out.case.send(<P> port.name, tag);
    this.out.val.send(value, tag);
  }
}
