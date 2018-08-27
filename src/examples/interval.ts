import {Interval, Logger, Node} from "..";

//@formatter:off
console.log(`
Increments counter at every 500ms intervals up to 10 then stops source stream.

Propagation graph:
Interval (500ms) --> Custom --> Logger
`);
//@formatter:on

class Custom extends Node<any, number> {
  private count: number = 0;

  public in(value: any): void {
    this.out(this.count++);
    if (this.count > 10) {
      const source = this.in['source'];
      clearInterval(source.timer);
    }
  }
}

const interval = new Interval(500);
const custom = new Custom();
const logger = new Logger();

interval.edge(custom);
custom.edge(logger);
