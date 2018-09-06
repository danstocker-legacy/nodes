import {InPort, Inputs, InputTracker, Logger, Node, OutPort} from "..";

class Adder extends Node {
  public readonly ports: {
    a: InPort<number>,
    b: InPort<number>,
    sum: OutPort<number>
  };
  private readonly inputTracker: InputTracker;

  constructor() {
    super();
    this.ports = {
      a: new InPort(this),
      b: new InPort(this),
      sum: new OutPort()
    };
    this.inputTracker = new InputTracker((inputs: Inputs) => {
      const sum = (inputs.get(this.ports.a) || 0) + (inputs.get(this.ports.b) || 0);
      this.ports.sum.send(sum);
    });
  }

  protected process(inputs: Inputs, tag?: string): void {
    this.inputTracker.send(inputs, tag);
  }
}

const adder: Adder = new Adder();
const logger: Logger = new Logger();

adder.ports.sum.connect(logger.ports.in);

adder.ports.a.send(1); // 1+0=1
adder.ports.b.send(1); // 1+1=2
adder.ports.a.send(2); // 2+1=3
adder.ports.b.send(2); // 2+2=4
