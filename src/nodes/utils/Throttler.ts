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

interface IThrottlerInputs {
  tag: any;
  tick: boolean;
}

type TThrottlerInput = IThrottlerInputs[keyof IThrottlerInputs];

/**
 * Emits a boolean with the last received input tag: `true` exactly on tick,
 * `false` on receiving a new input tag.
 * Atomic equivalent of a composite node.
 * Commonly used in conjunction with Filter and Folder.
 * Composite view:
 * TBD
 * @example
 * const throttler = new Throttler();
 * const ticker = new Ticker(1000);
 * ticker.out.$.connect(throttler.in.tick);
 * throttler.in.tag.connect(...);
 * throttler.out.$.connect(...);
 */
export class Throttler implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<IThrottlerInputs>;
  public readonly out: TOutPorts<{
    $: boolean
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes>;

  private readonly buffer: Array<string>;

  constructor() {
    Sink.init.call(this, ["tag", "tick"]);
    Source.init.call(this, ["$"]);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.buffer = [];
  }

  public send(
    port: IInPort<TThrottlerInput>,
    value: TThrottlerInput,
    tag?: string
  ): void {
    const buffer = this.buffer;
    switch (port) {
      case this.in.tick:
        // clock ticked
        // sending out last tag w/ true
        if (buffer.length) {
          this.out.$.send(true, buffer.shift());
        }
        break;

      case this.in.tag:
        // new tag arrived
        buffer.push(tag);

        if (buffer.length > 1) {
          // there is a previous tag in buffer
          // sending out last tag w/ false
          this.out.$.send(false, buffer.shift());
        }
        break;
    }
  }
}
