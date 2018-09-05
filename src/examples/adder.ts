import {INode, InPort, Inputs, Logger, OutPort} from "..";

class Adder implements INode {
  public readonly ports: {
    a: InPort<number>,
    b: InPort<number>,
    sum: OutPort<number>
  };
  private a: number;
  private b: number;

  constructor() {
    this.ports = {
      a: new InPort(this),
      b: new InPort(this),
      sum: new OutPort(this)
    };
  }

  public send(inputs: Inputs, tag?: string): void {
    if (inputs.has(this.ports.a)) {
      this.a = inputs.get(this.ports.a);
    }
    if (inputs.has(this.ports.b)) {
      this.b = inputs.get(this.ports.b);
    }
    this.ports.sum.send((this.a || 0) + (this.b || 0), tag);
  }
}

const adder: Adder = new Adder();
const logger: Logger = new Logger();

adder.ports.sum.connect(logger.ports.in);

adder.ports.a.send(1); // 1+0=1
adder.ports.b.send(1); // 1+1=2
adder.ports.a.send(2); // 2+1=3
adder.ports.b.send(2); // 2+2=4
