import {INode, InPort, OutPort} from "../node";

/**
 * Forwards batches of input values with throttling.
 */
export class Throttler<T> implements INode {
  public readonly ports: {
    in: InPort<T>,
    out: OutPort<Array<T>>
  };
  private readonly delay: number;
  private timer: NodeJS.Timer;
  private values: Array<any>;

  constructor(delay: number) {
    this.ports = {
      in: new InPort(this),
      out: new OutPort(this)
    };
    this.delay = delay;
    this.values = [];
  }

  public send(value: any, port: InPort<T>, timestamp?: number): void {
    if (port === this.ports.in) {
      this.values.push(value);

      const timer = this.timer;
      if (!timer) {
        const onTimeout = () => {
          const values = this.values;
          if (values.length) {
            this.timer = setTimeout(onTimeout, this.delay);
            this.values = [];
            this.ports.out.send(values, timestamp);
          } else {
            this.timer = undefined;
          }
        };

        this.timer = setTimeout(onTimeout, this.delay);
      }
    }
  }
}
