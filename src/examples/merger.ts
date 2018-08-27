import {Logger, Merger, Noop} from "..";

//@formatter:off
console.log(`
Propagation graph:
Noop --|
Noop --|--> Merger --> Logger
`);
//@formatter:on

const noop1 = new Noop();
const noop2 = new Noop();
const merger = new Merger<number>();
const logger = new Logger();

noop1.edge(merger);
noop2.edge(merger);
merger.edge(logger);

console.log("feeding 2 to noop1");
noop1.in(2);
console.log("feeding 3 to noop2");
noop2.in(3);
console.log("feeding 4 to noop2");
noop2.in(4);
