import {InPort, Inputs, Logger, OutPort, TrackerBase} from "..";

class Adder extends TrackerBase {
  public readonly in: {
    a: InPort<number>,
    b: InPort<number>
  };
  public readonly out: {
    sum: OutPort<number>
  };

  constructor() {
    super();
    this.openPort("a", new InPort(this));
    this.openPort("b", new InPort(this));
    this.openPort("sum", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    const sum = (inputs.get(this.in.a) || 0) + (inputs.get(this.in.b) || 0);
    this.out.sum.send(sum);
  }
}

const adder: Adder = new Adder();
const logger: Logger = new Logger();

adder.out.sum.connect(logger.in.$);

adder.in.a.send(1); // 1+0=1
adder.in.b.send(1); // 1+1=2
adder.in.a.send(2); // 2+1=3
adder.in.b.send(2); // 2+2=4
