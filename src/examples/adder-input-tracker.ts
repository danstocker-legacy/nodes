import {InPort, Inputs, InputTrackerNode, Logger, Node, OutPort} from "..";

class Adder extends InputTrackerNode {
  public readonly ports: {
    a: InPort<number>,
    b: InPort<number>,
    sum: OutPort<number>
  };

  constructor() {
    super();
    this.ports = {
      a: new InPort(this),
      b: new InPort(this),
      sum: new OutPort()
    };
  }

  protected process(inputs: Inputs, tag?: string): void {
    const sum = (inputs.get(this.ports.a) || 0) + (inputs.get(this.ports.b) || 0);
    this.ports.sum.send(sum);
  }
}

const adder: Adder = new Adder();
const logger: Logger = new Logger();

adder.ports.sum.connect(logger.ports.in);

adder.ports.a.send(1); // 1+0=1
adder.ports.b.send(1); // 1+1=2
adder.ports.a.send(2); // 2+1=3
adder.ports.b.send(2); // 2+2=4
