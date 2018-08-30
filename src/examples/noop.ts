import {Logger, Noop} from "..";

//@formatter:off
console.log(`
Propagation graph:
Noop:out --|--> in:Noop:out --|
           |--> in:Noop:out --|--> in:Logger
`);
//@formatter:on

const logger = new Logger();
const noop1 = new Noop<string>();
const noop2 = new Noop<string>();
const noop3 = new Noop<string>();

noop1.ports.out.connect(noop2.ports.in);
noop1.ports.out.connect(noop3.ports.in);
noop2.ports.out.connect(logger.ports.in);
noop3.ports.out.connect(logger.ports.in);

console.log("feeding \"Hello World!\" to noop1");
noop1.ports.in.in("Hello World!");
