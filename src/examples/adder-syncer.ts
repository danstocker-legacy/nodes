import {InPort, Inputs, Logger, OutPort, SyncerBase} from "..";

class Adder extends SyncerBase {
  public readonly in: {
    a: InPort<number>,
    b: InPort<number>
  };
  public readonly out: {
    sum: OutPort<number>
  };

  constructor() {
    super();
    this.openInPort("a", new InPort(this));
    this.openInPort("b", new InPort(this));
    this.openOutPort("sum", new OutPort());
  }

  protected process(inputs: Inputs, tag: string): void {
    const sum = (inputs.get(this.in.a) || 0) + (inputs.get(this.in.b) || 0);
    this.out.sum.send(sum);
  }
}

const adder = new Adder();
const logger = new Logger();

adder.out.sum.connect(logger.in.$);

adder.in.a.send(1, "1");
adder.in.b.send(1, "1"); // 1+1=2
adder.in.a.send(2, "2");
adder.in.b.send(2, "2"); // 2+2=4