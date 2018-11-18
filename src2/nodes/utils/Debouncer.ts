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

/**
 * Emits a debounce signal based on received inputs: `true` when timer has
 * finished, `false` when timer got interrupted by new input.
 * Atomic equivalent of a composite node.
 * Commonly used in conjunction with Filter and Folder.
 * Composite view:
 * TBD
 * @example
 * const debouncer = new Debouncer(500);
 */
export class Debouncer implements ISink, ISource, IEventSource, IErrorSource {
  public readonly in: TInPorts<{
    $: any
  }>;
  public readonly out: TOutPorts<{
    $: boolean
  }>;
  public readonly svc:
    TEventPorts<Sink.TEventTypes | Source.TEventTypes> &
    TErrorPorts<Sink.TErrorTypes>;

  private readonly ms: number;
  private readonly buffer: Array<string>;
  private timer: NodeJS.Timer;

  constructor(ms: number) {
    Sink.init.call(this);
    Source.init.call(this);
    Serviced.init.call(this);
    EventSource.init.call(this);
    ErrorSource.init.call(this);
    this.ms = ms;
    this.buffer = [];
    this.in.$ = new InPort("$", this);
    this.out.$ = new OutPort("$", this);
  }

  public send(port: IInPort<any>, value: any, tag: string): void {
    if (port === this.in.$) {
      const timer = this.timer;
      const buffer = this.buffer;
      buffer.push(tag);

      if (timer) {
        // interrupting timer
        clearTimeout(timer);
        const next = buffer.shift();
        this.out.$.send(false, next);
      }

      this.timer = setTimeout(() => {
        this.out.$.send(true, tag);
      }, this.ms);
    }
  }
}
