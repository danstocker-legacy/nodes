import {JsonStringifier, Logger} from "..";

//@formatter:off
console.log(`
Stringifies objects as JSON.

Propagation graph:
JsonStringifier --> Logger
`);
//@formatter:on

let stringifier = new JsonStringifier(true),
  logger = new Logger();

stringifier.edge(logger);

console.log("feeding {foo: \"bar\"} [object] to stringifier");
stringifier.in({foo: "bar"});