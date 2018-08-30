import {Filter, Logger} from "..";

//@formatter:off
console.log(`
Filtering out numbers higher than 5 and lower than 1;

Propagation graph:
Filter:out --> Logger:in
`);
//@formatter:on

const filter = new Filter<number>(value => value <= 5 && value > 0);
const logger = new Logger();

filter.ports.out.connect(logger.ports.in);

console.log("feeding 10 to filter");
filter.ports.in.in(10);
console.log("feeding 5 to filter");
filter.ports.in.in(5);
console.log("feeding 4 to filter");
filter.ports.in.in(4);
console.log("feeding -2 to filter");
filter.ports.in.in(-2);
