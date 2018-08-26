import {Logger, Stringifier} from "..";

//@formatter:off
console.log(`
Stringifies numbers.

Propagation graph:
Stringifier --> Logger
`);
//@formatter:on

let stringifier = new Stringifier<number>(),
  logger = new Logger();

stringifier.edge(logger);

console.log("feeding 1 [number] to stringifier");
stringifier.in(1);
