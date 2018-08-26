import {Logger, Noop} from "..";

//@formatter:off
console.log(`
Propagation graph:
noop1 --|--> noop2 --|
        |--> noop3 --|--> logger
`);
//@formatter:on

let logger = new Logger(),
    noop1 = new Noop(),
    noop2 = new Noop(),
    noop3 = new Noop();

noop1.edge(noop2, noop3);
noop2.edge(logger);
noop3.edge(logger);

console.log("feeding \"Hello World!\" to noop1");
noop1.in("Hello World!");
