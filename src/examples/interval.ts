import {INode, Interval, Logger, Port} from "..";

//@formatter:off
console.log(`
Increments counter at every 500ms intervals up to 10 then stops source stream.

Propagation graph:
Interval:out (500ms) --> in:Custom:out --> in:Logger
`);
//@formatter:on

class Custom implements INode {
  public readonly ports: {
    in: Port<null>,
    out: Port<number>
  };
  private count: number = 0;

  constructor() {
    this.ports = {
      in: new Port<null>(this),
      out: new Port<number>(this)
    };
  }

  public in(port: Port<null>, value: any): void {
    if (this.count >= 10) {
      const peer = port.in["peer"];
      const node = peer && peer.node;
      if (node instanceof Interval) {
        clearInterval(node.timer);
      }
    }
    this.ports.out.out(this.count++);
  }
}

const interval = new Interval(500);
const custom = new Custom();
const logger = new Logger();

interval.ports.out.connect(custom.ports.in);
custom.ports.out.connect(logger.ports.in);
