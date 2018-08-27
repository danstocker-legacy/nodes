import {Logger, Stringifier} from "..";

//@formatter:off
console.log(`
Stringifies numbers.

Propagation graph:
Stringifier --> Logger
`);
//@formatter:on

const stringifier = new Stringifier<number>();
const logger = new Logger();

stringifier.edge(logger);

console.log("feeding 1 [number] to stringifier");
stringifier.in(1);
