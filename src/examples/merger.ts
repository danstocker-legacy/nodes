import {Logger, Merger, Noop} from "..";

//@formatter:off
console.log(`
Propagation graph:
Noop:out --|
Noop:out --|--> in:Merger:out --> in:Logger
`);
//@formatter:on

const noop1 = new Noop();
const noop2 = new Noop();
const merger = new Merger<number>();
const logger = new Logger();

noop1.ports.out.connect(merger.ports.in);
noop2.ports.out.connect(merger.ports.in);
merger.ports.out.connect(logger.ports.in);

console.log("feeding 2 to noop1");
noop1.ports.in.in(2);
console.log("feeding 3 to noop2");
noop2.ports.in.in(3);
console.log("feeding 4 to noop2");
noop2.ports.in.in(4);
