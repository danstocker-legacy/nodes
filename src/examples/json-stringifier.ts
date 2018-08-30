import {JsonStringifier, Logger} from "..";

//@formatter:off
console.log(`
Stringifies objects as JSON.

Propagation graph:
JsonStringifier:out --> Logger:in
`);
//@formatter:on

const stringifier = new JsonStringifier(true);
const logger = new Logger();

stringifier.ports.out.connect(logger.ports.in);

console.log("feeding {foo: \"bar\"} [object] to stringifier");
stringifier.ports.in.in({foo: "bar"});
