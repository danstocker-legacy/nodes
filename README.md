Nodes
=====

Nodes is an [FRP](https://en.wikipedia.org/wiki/Functional_reactive_programming) 
library that models the processing network as an actual directed graph.

In *Nodes*, you build and maintain a network of function-like objects, and 
**push** streams of data through it.

Nodes supports classic FRP concepts like mapping / filtering, asynchronous 
features such as debouncing / throttling, and concurrency resolution with 
synchronization and sequencing (serialization).

The basic building block of a Nodes program is the *node*, which communicates 
through *ports*, and its primary function is to translate inputs to outputs. 
(Secondary and tertiary functions are: connecting / disconnecting, and 
opening / closing ports, depending on how dynamic the network is expected to 
be by the application.) Nodes may be composed into *super-nodes*.

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

Nodes comes with a number of built-in node types:

### Utilities

- `Logger`: Logs input to console.
- `SuperNode`: Groups nodes into a single node.
- `Tagger`: Forwards input to output with the tag changed.

### Forwarders

Input values of these nodes are sent to the output unchanged.

- `Batcher`: Sends input to output in batches of a given size.
- `Noop`: Forwards input to output.
- `AdHocSequencer`: Forwards input following a reference order.
- `AdHocSyncer`: Synchronizes inputs from multiple ports into a map on a single 
port.

### Functional

Nodes that perform purely functional operations.

- `ChangeFilter`: Sends input to output when it's different from the last input.
- `Filter`: Outputs only those inputs that satisfy the specified filter callback.
- `Mapper`: Sends mapped input to output.

### Input / output

Source and sink nodes.

- `StdErr`: Forwards input to `process.stderr`.
- `StdIn`: Takes input from `process.stdin` and sends it to output.
- `StdOut`: Forwards input to `process.stdout`.

### String

String manipulation.

- `JsonStringifier`: Sends object input to output as JSON string.
- `LineSplitter`: Splits input text and sends individual lines to output.
- `Stringifier`: Sends string representation of input to output.

### Timing

Tools for asynchronous data flow.

- `Delayer`: Forwards input to output with a delay.
- `Debouncer`: Forwards batches of input values with debouncing.
- `Throttler`: Forwards batches of input values with throttling.
- `Interval`: Outputs Unix timestamp at intervals.

### Abstract / base classes


- `Node`: General purpose 
- `Sequencer`: Pre-processes input so it's following a reference order.
- `Syncer`: Pre-processes input so values with the same tag stay together.
- `Tracker`: Pre-processes input so last values are always accessible.

Building a graph
----------------

Three steps are required to get a Nodes graph working:

1. Creating nodes
2. Connecting ports
3. Feeding data to nodes

### Creating nodes

To create a node, instantiate a node class.

Example: `const logger = new Logger()`.

### Connecting ports

Input and output ports of a node are accessible via the node's `in` and `out`
properties. Default ports are named `$` by convention. Connections can be made
by passing an input port to output ports' `#connect()` method.

Example: `stdIn.out.$.connect(logger.in.$);`

Connections may be made from either side, but it's customary to put the 
output port on the left hand side of `#connect()`.

### Feeding data to nodes

To feed data to a node, one must either invoke `#send()` explicitly, or 
connect to an output-only (*source*) node, such as `StdIn` or `Interval`.

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

`InPort#send()` takes a second argument, `tag`, which identifies an original 
input, and is used to synchronize individual impulses throughout the 
entire graph. Tags are expected by node classes like `Tagger`, `Syncer`,
`AdHocSyncer`, `Sequencer`, and `AdHocSequencer`.

Tags usually take the value of a timestamp, a unique identifier or a 
combination of these.

```typescript
// explicit: sends in "foo" with tag "1"
node.in.$.send("foo", "1");

// implicit: sends in the output of StdIn, with the current timestamp as tag
new StdIn().out.$.connect(node.in.$);
```

Implementing a node class
-------------------------

To create a new node type, subclass `Node`, or one of the other base classes:
`Tracker`, `Sequencer`, or `Syncer`. (More about these below.)

1. First, define port layout (public object properties `in` and `out`)
2. Then in the constructor, initialize these ports. Make sure this is the 
last thing the constructor does.
3. Optionally, handle port addition / removal, connecting / disconnecting by 
overriding `#onPortOpen()`, `#onPortClose()`, `#onConnect()`, and 
`#onDisconnect()`.
4. Implement `#process()`. This is where you define how and when outputs are 
invoked in response to inputs.

When initializing ports, instantiate `InPort<T>` or `OutPort<T>` passing the 
parent node as argument.

In some cases, like custom super-nodes, connections can be made in the node's
constructor. (See section "Custom super-nodes")

The following example implements a plain `Node` that adds two numeric inputs 
together.

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
    this.openOutPort("sum", new OutPort(this));
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

### Using `Tracker`

`Tracker` makes sure you always have the last value from each input port
available in your `#process()` implementation. This makes writing classic 
*reactive* nodes easier.

Consider how much more concise and maintainable the above `Adder` node becomes 
as a `Tracker` subclass:

```typescript
// node node_modules/@kwaia/nodes/examples/adder-tracker
import {InPort, Inputs, Logger, OutPort, Tracker} from "@kwaia/nodes";

class Adder extends Tracker {
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
    this.openOutPort("sum", new OutPort(this));
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

### Using `Syncer`

When paths fork and join in a graph, synchronizing inputs becomes crucial. 
For custom nodes that rely on multiple inputs, Nodes provides `Syncer` 
as a foundation. The `#process()` method of `Syncer` always receives its 
`inputs` argument with *all* inputs that correspond to any given tag.

    `Syncer` is currently only recommended as a static node as cached
    input values may be purged on closing ports.

Nodes based on `Syncer` are nearly identical to those based on 
`Tracker`, except for the base class, and tags which are to be passed to 
`#send()`, as both rely on the presence of all inputs in `#process()`. 
`Syncer` outputs only once for each tag.

Notice how `Adder`, as a subclass of `Syncer`, outputs only twice in our 
example as opposed to four above.

```typescript
// node node_modules/@kwaia/nodes/examples/adder-syncer
import {InPort, Inputs, Logger, OutPort, Syncer} from "@kwaia/nodes";

class Adder extends Syncer {
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
    this.openOutPort("sum", new OutPort(this));
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

### Using `Sequencer`

With ordinary functions, we expect outputs to be produced in the same order as 
inputs go in. To make sure this happens regardless of input order, Nodes 
comes with `Sequencer`.

    `Sequencer` is currently only recommended as a static node as cached
    input values may be purged on closing ports.

Nodes based on `Sequencer` are nearly identical to those based on 
`Tracker`, except for the base class, the input port `ref`, (reference) and 
tags to be passed to `#send()`. `Sequencer` outputs in the order 
specified by tags sent in on the reference input port, which is why it's 
important to have `ref` connected to the right source before sending to any 
of the other input ports.

Notice the extra inputs sent to `ref`, as well as the order of outputs near the
end of the example below, which implements `Adder` derived from 
`Sequencer`. 

```typescript
// node node_modules/@kwaia/nodes/examples/adder-sequencer
import {InPort, Inputs, Logger, OutPort, Sequencer} from "@kwaia/nodes";

class Adder extends Sequencer {
  public readonly in: {
    ref: InPort<string>,
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
    this.openOutPort("sum", new OutPort(this));
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

adder.in.ref.send(null, "1");
adder.in.ref.send(null, "2");
adder.in.a.send(1, "2"); // third: 1+1=2
adder.in.b.send(1, "1"); // first: 0+1=1
adder.in.a.send(2, "1"); // second: 2+1=3
adder.in.b.send(2, "2"); // last: 1+2=3
```

Ad-hoc super-nodes
------------------

A super-node is a node with internal structure made up of primitive nodes. 
Super-nodes do not open ports themselves, but inherit ports from their 
children.

Ad-hoc super-nodes present a convenient way of re-using larger functional 
units of the program. Super-nodes may be nested.

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
nodes only connect to sibling nodes, in other words, there are no 
connections outside the super-node. (Except through ports shared with the 
super-node.)

Custom super-nodes
------------------

Ad-hoc super-nodes are sufficient in most (static graph) use cases, but if 
we intend to create complex, or reusable super-nodes, it's a better option to
subclass `Node`.

Custom super-nodes have to:

1. create their own child nodes,
2. set up internal connections,
3. assign output ports, and
4. direct input values to child nodes' ports in `#process()`

In the case of super-node classes, `#process()` sends input values of the 
super-node to input ports of child nodes, instead of sending processed values
to output ports. This allows super-nodes to be based on either of the 
available base classes: `Node`, `Tracker`, `Syncer`, and `Sequencer`.

The following example does exactly the same as the ad-hoc version above, but 
as a super-node class in its own right.

```typescript
// node node_modules/@kwaia/nodes/examples/json-logger
import {InPort, Inputs, JsonStringifier, Logger, Node} from "@kwaia/nodes";

class JsonLogger extends Node {
  public readonly in: {
    $: InPort<object>
  };
  private readonly jsonStringifier: JsonStringifier<object>;

  constructor() {
    super();
    const jsonStringifier = new JsonStringifier(true);
    const logger = new Logger();
    this.jsonStringifier = jsonStringifier;
    jsonStringifier.out.$.connect(logger.in.$);
    this.openInPort("$", new InPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.in.$);
    this.jsonStringifier.in.$.send(value, tag);
  }
}

const jsonLogger = new JsonLogger();
jsonLogger.in.$.send({foo: "bar"});
```

Planned features
----------------

- [ ] Trail: how inputs arrived at the current node.
- [ ] State snapshot: saving & restoring overall state of the graph.
- [ ] Error handling: error ports for built-in nodes.
- [ ] Visual graph snapshot: generating image of nodes and connections.
- [ ] Visual debugging: annotating graph with traffic statistics.
