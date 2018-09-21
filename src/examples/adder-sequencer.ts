import {InPort, Inputs, Logger, OutPort, SequencerBase} from "..";

class Adder extends SequencerBase {
  public readonly in: {
    ref: InPort<string>,
    a: InPort<number>,
    b: InPort<number>
  };
  public readonly out: {
    sum: OutPort<number>
  };
  private a: number;
  private b: number;

  constructor() {
    super();
    this.openInPort("a", new InPort(this));
    this.openInPort("b", new InPort(this));
    this.openOutPort("sum", new OutPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    if (inputs.has(this.in.a)) {
      this.a = inputs.get(this.in.a);
    }
    if (inputs.has(this.in.b)) {
      this.b = inputs.get(this.in.b);
    }
    this.out.sum.send((this.a || 0) + (this.b || 0), tag);
  }
}

const adder = new Adder();
const logger = new Logger();

adder.out.sum.connect(logger.in.$);

adder.in.ref.send(null, "1");
adder.in.ref.send(null, "2");
adder.in.a.send(1, "2"); // third: 1+1=2
adder.in.b.send(1, "1"); // first: 0+1=1
adder.in.a.send(2, "1"); // second: 2+1=3
adder.in.b.send(2, "2"); // last: 1+2=3
