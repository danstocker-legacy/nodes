import {Debouncer, Delayer, Logger} from "..";

//@formatter:off
console.log(`
Sends inputs to output debounced.

Propagation graph:
Delayer (1500ms) --|
Delayer (1000ms) --|
Delayer (500ms)  --|--> Debouncer (1000ms) --> Logger
`);
//@formatter:on

const delayer1 = new Delayer<string>(1500);
const delayer2 = new Delayer<string>(1000);
const delayer3 = new Delayer<string>(500);
const debouncer = new Debouncer<string>(1000);
const logger = new Logger();

delayer1.edge(debouncer);
delayer2.edge(debouncer);
delayer3.edge(debouncer);
debouncer.edge(logger);

console.log("feeding \"Hello\" to delayer1");
delayer1.in("Hello");
console.log("feeding \"World\" to delayer2");
delayer2.in("World");
console.log("feeding \"!\" to delayer3");
delayer3.in("!");
