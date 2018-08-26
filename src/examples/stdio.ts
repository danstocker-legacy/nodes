import {StdIn, StdOut} from "../stdio";

//@formatter:off
console.log(`
Piping standard input to standard output.

Propagation graph:
StdIn --> StdOut
`);
//@formatter:on

let stdIn = new StdIn(),
    stdOut = new StdOut();

stdIn.edge(stdOut);
