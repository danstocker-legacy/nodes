Nodes
=====

Nodes is a reactive library for processing streaming data.

In Nodes, the basic processing unit is the *node*, which is similar to a 
function, in that it takes *inputs* and produces *outputs*. But instead of 
arguments and return value, it communicates through *ports*. A node may have 
any number of ports, but most nodes have one input and one output port. Ports
may be connected between nodes, forming a web, or graph, and defining the 
flow of data through the system.

Nodes comes with a set of pre-defined node classes, like Mapper, Filter, etc.
but the power of this library lies in its extensibility. Any (custom) node 
has two responsibilities: a) define a set of ports, and b) process and 
distribute inputs to outputs in a single override method.

Composition of nodes is also quite simple with the SuperNode. Any set of  
interacting nodes might be treated as a single node, provided that relevant  
input and output ports are assigned.

Programs written in Nodes are essentially graphs, (or more precisely,  
orchestrators of graphs) which are, by their nature, easy to visualize and  
diagnose.

Nodes is developed in [TypeScript](http://www.typescriptlang.org/).

Nodes is a [Kwaia](http://kwaia.com) project.

Supported processor nodes
-------------------------

### Generic

- `SuperNode`: Groups nodes into a single node.
- `Noop`: Forwards input to output.
- `Splitter`: Forwards input to multiple outputs.
- `Batcher`: Sends input to output in batches of a given size.
- `Logger`: Logs input to console.
- `LineSplitter`: Splits input text and sends individual lines to output.
- `Stringifier`: Sends string representation of input to output.
- `JsonStringifier`: Sends object input to output as JSON string.

### Functional

- `Filter`: Outputs only those inputs that satisfy the specified filter callback.
- `Mapper`: Sends mapped input to output.
- `ChangeFilter`: Sends input to output when it's different from the last input.

### Timing

- `Delayer`: Forwards input to output with a delay.
- `Debouncer`: Forwards batches of input values with debouncing.
- `Throttler`: Forwards batches of input values with throttling.
- `Interval`: Outputs `null` at intervals.

### StdIO

- `StdIn`: Takes input from `process.stdin` and sends it to output.
- `StdOut`: Forwards input to `process.stdout`.
- `StdErr`: Forwards input to `process.stderr`.

Creating a simple graph
-----------------------

The following example reads from standard input, counts line lengths, and 
logs the results to console.

```typescript
import {LineSplitter, Logger, Mapper, StdIn} from "@kwaia/nodes";
const logger: Logger = new Logger();
const stdIn: StdIn = new StdIn();
const mapper: Mapper<string, number> = new Mapper(line => line.length);
const lineSplitter: LineSplitter = new LineSplitter();
stdIn.ports.out.connect(lineSplitter.ports.in);
lineSplitter.ports.out.connect(mapper.ports.in);
mapper.ports.out.connect(logger.ports.in);
```

Implementing a node class
-------------------------

TBD

### Filtering by input node

TBD

Creating an ad-hoc super-node
----------------------------

TBD

Implementing a super-node class
------------------------------

TBD

Debugging a Nodes program
-------------------------

TBD

Examples
--------

TBD

Planned features
----------------

[ ] Trail: how data got to the current node.
[ ] State snapshot: saving & restoring overall state of the graph.
[ ] Visual graph snapshot: generating image of nodes and connections.
[ ] Visual debugging: annotating graph with traffic statistics.
