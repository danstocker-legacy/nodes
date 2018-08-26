import {Logger, Mapper} from "..";

//@formatter:off
console.log(`
Mapping input numbers to their doubles.

Propagation graph:
Mapper --> Logger
`);
//@formatter:on

let mapper = new Mapper<number, number>(value => value * 2),
  logger = new Logger();

mapper.edge(logger);

console.log("feeding 1 to mapper");
mapper.in(1);
console.log("feeding 2 to mapper");
mapper.in(2);
console.log("feeding 3 to mapper");
mapper.in(3);
