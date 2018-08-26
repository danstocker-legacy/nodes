import {StdIn, StdOut} from "../stdio"

let stdIn = new StdIn(),
    stdOut = new StdOut();

//@formatter:off
console.log(`
Piping standard input to standard output.

Propagation graph:
stdIn --> stdOut
`);
//@formatter:on

stdIn.edge(stdOut);
