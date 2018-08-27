import {LineSplitter, Logger, Mapper, StdIn, Stringifier} from "..";

//@formatter:off
console.log(`
Listing line lengths in file passed to standard input.

Propagation graph:
StdIn --> Stringifier --> LineSplitter --> Mapper --> Logger
`);
//@formatter:on

const stdIn = new StdIn();
const stringifier = new Stringifier();
const lineSplitter = new LineSplitter();
const lengthCounter = new Mapper<string, number>(line => line.length);
const logger = new Logger();

stdIn.edge(stringifier);
stringifier.edge(lineSplitter);
lineSplitter.edge(lengthCounter);
lengthCounter.edge(logger);
