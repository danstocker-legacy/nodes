Nodes
=====

Nodes is an [FRP](https://en.wikipedia.org/wiki/Functional_reactive_programming) 
library that models the processing network as an actual directed graph.

**We're getting close to a stable API. Breaking changes are not expected.**

In *Nodes*, you build and maintain a network of function-like objects, and 
**push** streams of data through it.

Nodes supports classic FRP concepts like map / reduce; asynchronous features 
such as debouncing / throttling, and concurrency resolution with 
synchronization and sequencing (serialization).

The basic building block of a Nodes program is the 'functionesque' *node*, 
which communicates through *ports*, and its primary function is to translate 
inputs to outputs. (Secondary and tertiary functions are: making & destroying
connections, and opening / closing ports, depending on how dynamic the network
is expected to be by the application.) Nodes may be composed into *super-nodes*.

Nodes is developed in [TypeScript](http://www.typescriptlang.org/).

Nodes is a [Kwaia](http://kwaia.com) project.

Getting started
---------------

1. Install via NPM: `npm i @kwaia/nodes`
2. In your code, import the relevant classes / interfaces.

Eg.
```typescript
import {LineSplitter, Logger, Mapper, StdIn} from "@kwaia/nodes";
```

All code samples in this document are also included in the npm package under 
`/examples`. You may run them using the command provided in the first line of
each code section.

Built-in nodes
--------------

### Generic

- `SuperNode`: Groups nodes into a single node.
- `Noop`: Forwards input to output.
- `Splitter`: Forwards input to multiple outputs.
- `Batcher`: Sends input to output in batches of a given size.
- `Logger`: Logs input to console.
- `LineSplitter`: Splits input text and sends individual lines to output.
- `Stringifier`: Sends string representation of input to output.
- `JsonStringifier`: Sends object input to output as JSON string.
- `Tagger`: Forwards input to output with the tag changed.

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

Orchestrating the graph
-----------------------

Three steps are required to get a Nodes graph working:

1. Create nodes
2. Connect ports
3. Feed data to relevant input ports

The following example reads from standard input, counts line lengths, and 
logs the results to console.

```typescript
// node node_modules/@kwaia/nodes/examples/line-length-count
import {LineSplitter, Logger, Mapper, StdIn} from "@kwaia/nodes";

const logger: Logger = new Logger();
const stdIn: StdIn = new StdIn();
const mapper: Mapper<string, number> = new Mapper((line) => line.length);
const lineSplitter: LineSplitter = new LineSplitter();
stdIn.out.$.connect(lineSplitter.in.$);
lineSplitter.out.$.connect(mapper.in.$);
mapper.out.$.connect(logger.in.$);
```

### Static vs. dynamic graph

Nodes supports setting up the graph both statically, and dynamically. In a 
static graph, connections are set up once, before running data through it. 
Whereas in dynamic graphs, connections may change as the input changes. Most 
use cases don't justify a dynamic graph, but problems such as neural networks 
and concept graphs rely heavily on forming new and destroying old connections
between nodes.

Implementing a node class
-------------------------

To create a new node class, one must implement the `INode` interface, 
defining `ports` and implementing `#send()`. In the case of nodes with more 
than one input port, it is important that the `#send()` implementation 
handles missing values and buffers intermediate ones.

The following example implements addition of two numeric inputs.

```typescript
// node node_modules/@kwaia/nodes/examples/adder
import {InPort, Inputs, Logger, Node, OutPort} from "@kwaia/nodes";

class Adder extends Node {
  public readonly in: {
    a: InPort<number>,
    b: InPort<number>
  };
  public readonly out: {
    sum: OutPort<number>
  };
  private a: number;
  private b: number;

  constructor() {
    super();
    this.openInPort("a", new InPort(this));
    this.openInPort("b", new InPort(this));
    this.openOutPort("sum", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    if (inputs.has(this.in.a)) {
      this.a = inputs.get(this.in.a);
    }
    if (inputs.has(this.in.b)) {
      this.b = inputs.get(this.in.b);
    }
    this.out.sum.send((this.a || 0) + (this.b || 0), tag);
  }
}

const adder: Adder = new Adder();
const logger: Logger = new Logger();

adder.out.sum.connect(logger.in.$);

adder.in.a.send(1); // 1+0=1
adder.in.b.send(1); // 1+1=2
adder.in.a.send(2); // 2+1=3
adder.in.b.send(2); // 2+2=4
```

Creating an ad-hoc super-node
----------------------------

The super-node is a graph in its own right. Child nodes, which make up the 
super-node, may lend their unconnected ports to the super-node, as the 
super-node's own ports.

Ad-hoc super-nodes present a convenient way of creating functional units 
within the overall graph by grouping individual nodes. It's possible 
(and often necessary) to nest super-nodes.

```typescript
// node node_modules/@kwaia/nodes/examples/ad-hoc-super-node
import {JsonStringifier, Logger, SuperNode} from "@kwaia/nodes";

const jsonStringifier: JsonStringifier<object> = new JsonStringifier(true);
const logger: Logger = new Logger();
jsonStringifier.out.$.connect(logger.in.$);

const jsonLogger: SuperNode = new SuperNode({
  in: jsonStringifier.in.$
});

jsonLogger.in.$.send({foo: "bar"});
```

When creating ad-hoc super-nodes, the developer must make sure that child 
nodes only connect to other child nodes, in other words, there are no 
connections outside the super-node. (Except through the super-node's own ports.)

Implementing a super-node class
------------------------------

While ad-hoc super-nodes are enough in most (static graph) use cases, it's a 
good idea to always create a `SuperNode` class in order to separate super-node 
behavior from the rest of the program.

With a `SuperNode` subclass, super-nodes

1. create their own child nodes,
2. set up internal connections, and
3. assign ports

The following example does exactly the same as the ad-hoc version above, but 
subclasses `SuperNode`.

```typescript
// node node_modules/@kwaia/nodes/examples/json-logger
import {SuperNode, JsonStringifier, Logger} from "@kwaia/nodes";

class JsonLogger extends SuperNode {
  constructor() {
    const jsonStringifier: JsonStringifier<object> = new JsonStringifier(true);
    const logger: Logger = new Logger();
    jsonStringifier.out.$.connect(logger.in.$);

    super({
      in: jsonStringifier.in.$
    });
  }
}

const jsonLogger: JsonLogger = new JsonLogger();
jsonLogger.in.$.send({foo: "bar"});
```

Debugging a Nodes program
-------------------------

TBD

Planned features
----------------

- [ ] Trail: how data got to the current node.
- [ ] State snapshot: saving & restoring overall state of the graph.
- [ ] Error handling: error ports for built-in nodes.
- [ ] Visual graph snapshot: generating image of nodes and connections.
- [ ] Visual debugging: annotating graph with traffic statistics.
