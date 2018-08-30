import {Delayer, Logger} from "..";

//@formatter:off
console.log(`
Sends inputs to output with a delay.

Propagation graph:
Delayer:out (1500ms) --|
Delayer:out (1000ms) --|
Delayer:out (500ms)  --|--> in:Logger
`);
//@formatter:on

const delayer1 = new Delayer<string>(1500);
const delayer2 = new Delayer<string>(1000);
const delayer3 = new Delayer<string>(500);
const logger = new Logger();

delayer1.ports.out.connect(logger.ports.in);
delayer2.ports.out.connect(logger.ports.in);
delayer3.ports.out.connect(logger.ports.in);

console.log("feeding \"Hello\" to delayer1:in");
delayer1.ports.in.in("Hello");
console.log("feeding \"World\" to delayer2:in");
delayer2.ports.in.in("World");
console.log("feeding \"!\" to delayer3:in");
delayer3.ports.in.in("!");
