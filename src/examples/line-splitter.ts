import {LineSplitter, Logger, Mapper, StdIn, Stringifier} from "..";

//@formatter:off
console.log(`
Listing line lengths in file passed to standard input.

Propagation graph:
StdIn --> Stringifier --> LineSplitter --> Mapper --> Logger
`);
//@formatter:on

let stdIn = new StdIn(),
    stringifier = new Stringifier(),
    lineSplitter = new LineSplitter(),
    lengthCounter = new Mapper<string, number>(line => line.length),
    logger = new Logger();

stdIn.edge(stringifier);
stringifier.edge(lineSplitter);
lineSplitter.edge(lengthCounter);
lengthCounter.edge(logger);
