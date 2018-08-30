import {LineSplitter, Logger, Mapper, StdIn, Stringifier} from "..";

//@formatter:off
console.log(`
Listing line lengths in file passed to standard input.

Propagation graph:
StdIn:out --> in:Stringifier:out --> in:LineSplitter:out --> in:Mapper:out 
  --> in:Logger
`);
//@formatter:on

const stdIn = new StdIn();
const stringifier = new Stringifier();
const lineSplitter = new LineSplitter();
const lengthCounter = new Mapper<string, number>(line => line.length);
const logger = new Logger();

stdIn.ports.out.connect(stringifier.ports.in);
stringifier.ports.out.connect(lineSplitter.ports.in);
lineSplitter.ports.out.connect(lengthCounter.ports.in);
lengthCounter.ports.out.connect(logger.ports.in);
