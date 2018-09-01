import {INode, InPort, Logger, OutPort} from "..";

class Adder implements INode {
  public readonly ports: {
    a: InPort<number>,
    b: InPort<number>,
    sum: OutPort<number>
  };
  private readonly inputs: Map<InPort<number>, number>;

  constructor() {
    this.ports = {
      a: new InPort(this),
      b: new InPort(this),
      sum: new OutPort(this)
    };
    this.inputs = new Map();
  }

  public send(port: InPort<number>, value: number): void {
    if (port === this.ports.a || port === this.ports.b) {
      let sum: number = 0;
      this.inputs.set(port, value);
      for (let value of this.inputs.values()) {
        sum += value;
      }
      this.ports.sum.send(sum);
    }
  }
}

const adder = new Adder();
const logger = new Logger();

adder.ports.sum.connect(logger.ports.in);

adder.ports.a.send(1);
adder.ports.b.send(1);
adder.ports.a.send(2);
adder.ports.b.send(2);
