import {Filter, Logger} from "..";

//@formatter:off
console.log(`
Filtering out numbers higher than 5 and lower than 1;

Propagation graph:
Filter --> Logger
`);
//@formatter:on

const filter = new Filter<number>(value => value <= 5 && value > 0);
const logger = new Logger();

filter.edge(logger);

console.log("feeding 10 to filter");
filter.in(10);
console.log("feeding 5 to filter");
filter.in(5);
console.log("feeding 4 to filter");
filter.in(4);
console.log("feeding -2 to filter");
filter.in(-2);
