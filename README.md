Nodes
=====

Nodes is an [FRP](https://en.wikipedia.org/wiki/Functional_reactive_programming) 
library that models the processing network as an actual directed graph.

**We're getting close to a stable API. Breaking changes are not expected 
anymore.**

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

Nodes comes with a number of useful node types:

### Utilities

- `Logger`: Logs input to console.
- `Tagger`: Forwards input to output with the tag changed.

### Forwarders

Input values of these nodes are sent to the output unchanged.

- `Batcher`: Sends input to output in batches of a given size.
- `Noop`: Forwards input to output.
- `Sequencer`: Forwards input following a reference order.
- `Splitter`: Forwards input to multiple outputs.
- `Syncer`: Synchronizes inputs from multiple ports into a map on a single 
port.

### Functional

- `ChangeFilter`: Sends input to output when it's different from the last input.
- `Filter`: Outputs only those inputs that satisfy the specified filter callback.
- `Mapper`: Sends mapped input to output.

### Input / output

- `StdErr`: Forwards input to `process.stderr`.
- `StdIn`: Takes input from `process.stdin` and sends it to output.
- `StdOut`: Forwards input to `process.stdout`.

### String

- `JsonStringifier`: Sends object input to output as JSON string.
- `LineSplitter`: Splits input text and sends individual lines to output.
- `Stringifier`: Sends string representation of input to output.

### Timing

- `Delayer`: Forwards input to output with a delay.
- `Debouncer`: Forwards batches of input values with debouncing.
- `Throttler`: Forwards batches of input values with throttling.
- `Interval`: Outputs `null` at intervals.

### Abstract / base classes

- `SequencerBase`: Pre-processes input so it's following a reference order.
- `SuperNode`: Groups nodes into a single node.
- `SyncerBase`: Pre-processes input so values with the same tag stay together.

Building a graph
----------------

Three steps are required to get a Nodes graph working:

1. Creating nodes
2. Connecting ports
3. Feeding data to relevant input ports

The following example reads from standard input, counts line lengths, and 
logs the results to console.

```typescript
// node node_modules/@kwaia/nodes/examples/line-length-count
import {LineSplitter, Logger, Mapper, StdIn} from "@kwaia/nodes";

const logger = new Logger();
const stdIn = new StdIn();
const mapper = new Mapper<string, number>((line) => line.length);
const lineSplitter = new LineSplitter();
stdIn.out.$.connect(lineSplitter.in.$);
lineSplitter.out.$.connect(mapper.in.$);
mapper.out.$.connect(logger.in.$);
```

### Feeding data to a node

Once a graph is set up like above, nodes are ready to accept input. Data may 
be fed into the graph explicitly, or, connecting up output-only nodes like 
`StdIn` on `Interval`.

`InPort#send()` takes a second argument, `tag`, which identifies the origin 
of the input, and is used to synchronize individual impulses throughout the 
entire network. Tags usually take the value of a timestamp, or a unique 
identifier of the piece of data being processed. Tags are heavily relied on 
in the case of `Tagger`, `SyncerBase`, `Syncer`, `SequencerBase`, and 
`Sequencer`.

```typescript
// explicit: sends in "foo" with tag "1"
node.in.$.send("foo", "1");

// implicit: sends in the output of StdIn, with the current timestamp
new StdIn().out.$.connect(node.in.$);
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

To create a new node type, subclass `Node`, or one of the other base classes:
`TrackerBase`, `SequencerBase`, or `SyncerBase`.

1. First, define port layout (public object properties `in` and `out`)
2. Then in the constructor, initialize these ports. Make sure this is the 
last thing the constructor does.
3. Optionally, handle port addition and removal by overriding `#onPortOpen()`
and `#onPortClose()`.
4. Implement `#process()`. This is where you define how nd when outputs are 
invoked in response to inputs.

The following example implements a node that adds two numeric inputs together.

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

const adder = new Adder();
const logger = new Logger();

adder.out.sum.connect(logger.in.$);

adder.in.a.send(1); // 1+0=1
adder.in.b.send(1); // 1+1=2
adder.in.a.send(2); // 2+1=3
adder.in.b.send(2); // 2+2=4
```

### Using `TrackerBase`

`TrackerBase` makes sure you always have the last value from each input port
available in your `#process()` implementation. This makes writing classic 
*reactive* nodes easier.

Consider how much more concise and maintainable the above `Adder` node becomes 
as a `TrackerBase` subclass:

```typescript
// node node_modules/@kwaia/nodes/examples/adder-tracker
import {InPort, Inputs, Logger, OutPort, TrackerBase} from "@kwaia/nodes";

class Adder extends TrackerBase {
  public readonly in: {
    a: InPort<number>,
    b: InPort<number>
  };
  public readonly out: {
    sum: OutPort<number>
  };

  constructor() {
    super();
    this.openInPort("a", new InPort(this));
    this.openInPort("b", new InPort(this));
    this.openOutPort("sum", new OutPort());
  }

  protected process(inputs: Inputs, tag?: string): void {
    const sum = (inputs.get(this.in.a) || 0) + (inputs.get(this.in.b) || 0);
    this.out.sum.send(sum);
  }
}

const adder = new Adder();
const logger = new Logger();

adder.out.sum.connect(logger.in.$);

adder.in.a.send(1); // 1+0=1
adder.in.b.send(1); // 1+1=2
adder.in.a.send(2); // 2+1=3
adder.in.b.send(2); // 2+2=4
```

### Using `SyncerBase`

When working with asynchronous networks, especially ones that involve paths 
that run parallel, then come back together, synchronizing inputs may very 
well be the most important thing to do. For any custom node type that relies 
on multiple inputs, `SyncerBase` is a fitting foundation. The `#process()` 
method of `SyncerBase` always receives its `inputs` argument with *all* 
inputs that correspond to any given tag.

Nodes that are based on `SyncerBase` are nearly identical to those based on 
`TrackerBase`, except for the base class and tags, because both rely on the 
presence of all inputs in `#process()`. `SyncerBase`, however, requires tags 
to be present in calls to `#send()`, and output only once for each tag.

Our usual `Adder` node, implemented on top of `SyncerBase`:

```typescript
// node node_modules/@kwaia/nodes/examples/adder-syncer
import {InPort, Inputs, Logger, OutPort, SyncerBase} from "@kwaia/nodes";

class Adder extends SyncerBase {
  public readonly in: {
    a: InPort<number>,
    b: InPort<number>
  };
  public readonly out: {
    sum: OutPort<number>
  };

  constructor() {
    super();
    this.openInPort("a", new InPort(this));
    this.openInPort("b", new InPort(this));
    this.openOutPort("sum", new OutPort());
  }

  protected process(inputs: Inputs, tag: string): void {
    const sum = (inputs.get(this.in.a) || 0) + (inputs.get(this.in.b) || 0);
    this.out.sum.send(sum);
  }
}

const adder = new Adder();
const logger = new Logger();

adder.out.sum.connect(logger.in.$);

adder.in.a.send(1, "1");
adder.in.b.send(1, "1"); // 1+1=2
adder.in.a.send(2, "2");
adder.in.b.send(2, "2"); // 2+2=4
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

const jsonStringifier = new JsonStringifier<object>(true);
const logger = new Logger();
jsonStringifier.out.$.connect(logger.in.$);

const jsonLogger = new SuperNode({
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
    const jsonStringifier = new JsonStringifier<object>(true);
    const logger = new Logger();
    jsonStringifier.out.$.connect(logger.in.$);

    super({
      in: jsonStringifier.in.$
    });
  }
}

const jsonLogger = new JsonLogger();
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
