import {Delayer, Logger, Throttler} from "..";

//@formatter:off
console.log(`
Sends inputs to output throttled.

Propagation graph:
Delayer (1500ms) --|
Delayer (1000ms) --|
Delayer (500ms)  --|--> Throttler (500ms) --> Logger
`);
//@formatter:on

const delayer1 = new Delayer<string>(1500);
const delayer2 = new Delayer<string>(1000);
const delayer3 = new Delayer<string>(500);
const throttler = new Throttler<string>(500);
const logger = new Logger();

delayer1.edge(throttler);
delayer2.edge(throttler);
delayer3.edge(throttler);
throttler.edge(logger);

console.log("feeding \"Hello\" to delayer1");
delayer1.in("Hello");
console.log("feeding \"World\" to delayer2");
delayer2.in("World");
console.log("feeding \"!\" to delayer3");
delayer3.in("!");
