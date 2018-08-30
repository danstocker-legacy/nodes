import {Logger, Noop} from "..";

//@formatter:off
console.log(`
Propagation graph:
Noop:out --> Logger:in
`);
//@formatter:on

const noop = new Noop<string>();
const logger = new Logger();

noop.ports.out.connect(logger.ports.in);

console.log("feeding \"Hello World!\" to noop:in");
noop.ports.in.in("Hello World!");
