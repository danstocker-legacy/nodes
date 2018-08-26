import {Debouncer, Delayer, Logger} from "..";

//@formatter:off
console.log(`
Sends inputs to output debounced.

Propagation graph:
delayer1 (1500ms) --|
delayer2 (1000ms) --|
delayer3 (500ms)  --|--> debouncer (1000ms) --> logger
`);
//@formatter:on

let delayer1 = new Delayer(1500),
    delayer2 = new Delayer(1000),
    delayer3 = new Delayer(500),
    debouncer = new Debouncer(1000),
    logger = new Logger();

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