import {StdIn, StdOut} from "../stdio";

//@formatter:off
console.log(`
Piping standard input to standard output.

Propagation graph:
StdIn:out --> StdOut:in
`);
//@formatter:on

const stdIn = new StdIn();
const stdOut = new StdOut();

stdIn.ports.out.connect(stdOut.ports.in);
