import {INode, InPort, Logger, OutPort} from "..";

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

  public send(value: number, port: InPort<number>, timestamp?: number): void {
    switch (port) {
      case this.ports.a:
        this.a = value;
        this.ports.sum.send(this.a + (this.b || 0), timestamp);
        break;
      case this.ports.b:
        this.b = value;
        this.ports.sum.send((this.a || 0) + this.b, timestamp);
        break;
    }
  }
}

const adder: Adder = new Adder();
const logger: Logger = new Logger();

adder.ports.sum.connect(logger.ports.in);

adder.ports.a.send(1); // 1+0=1
adder.ports.b.send(1); // 1+1=2
adder.ports.a.send(2); // 2+1=3
adder.ports.b.send(2); // 2+2=4
