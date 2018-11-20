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

interface ISwitchInputs<P extends string, T> {
  val: T;
  case: P;
}

type TSwitchOutputs<P extends string, T> = {
  [K in P]: T
};

/**
 * Forwards input to one of the possible outputs.
 * Atomic equivalent of a composite node.
 * Composite view:
 * $ -----#=> Joiner -> Mapper -> Demuxer -+-> A
 * case --/                                +-> B
 *                                         +-> C
 *                                         ...
 * @example
 * let switch: Switch<"foo" | "bar" | "baz", number>;
 * switch = new Switch(["foo", "bar", "baz");
 */
export class Switch<P extends string, T>
  implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: ISwitchInputs<P, T>
  }>;
  public readonly out: TOutPorts<TSwitchOutputs<P, T>>;
  public svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes | "INVALID_CASE">;

  /**
   * @param cases Strings identifying possible cases for switch.
   */
  constructor(cases: Array<string>) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.in.$ = new InPort("$", this);
    for (const field of cases) {
      this.out[field] = new OutPort(field, this);
    }
  }

  public send(
    port: IInPort<ISwitchInputs<P, T>>,
    value: ISwitchInputs<P, T>,
    tag?: string
  ): void {
    if (port === this.in.$) {
      const name = value.case;
      const outPort = this.out[name];
      if (outPort) {
        outPort.send(value.val, tag);
      } else {
        this.svc.err.send({
          payload: {
            case: name
          },
          type: "INVALID_CASE"
        }, tag);
      }
    }
  }
}
