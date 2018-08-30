import {Logger, Stringifier} from "..";

//@formatter:off
console.log(`
Stringifies numbers.

Propagation graph:
Stringifier:out --> in:Logger
`);
//@formatter:on

const stringifier = new Stringifier<number>();
const logger = new Logger();

stringifier.ports.out.connect(logger.ports.in);

console.log("feeding 1 [number] to stringifier:in");
stringifier.ports.in.in(1);
