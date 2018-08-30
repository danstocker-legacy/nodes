import {Logger, Mapper} from "..";

//@formatter:off
console.log(`
Mapping input numbers to their doubles.

Propagation graph:
Mapper:out --> in:Logger
`);
//@formatter:on

const mapper = new Mapper<number, number>(value => value * 2);
const logger = new Logger();

mapper.ports.out.connect(logger.ports.in);

console.log("feeding 1 to mapper");
mapper.ports.in.in(1);
console.log("feeding 2 to mapper");
mapper.ports.in.in(2);
console.log("feeding 3 to mapper");
mapper.ports.in.in(3);
