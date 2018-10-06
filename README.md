Nodes
=====

Nodes is an [FRP](https://en.wikipedia.org/wiki/Functional_reactive_programming) 
library that models the processing network as an actual directed graph.

In *Nodes*, you build and maintain a network of function-like objects, and 
**push** streams of data through it.

Nodes supports classic FRP concepts like map / filter / reduce, asynchronous 
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

**Hello world**

```typescript
// node node_modules/@kwaia/nodes/examples/helloworld
import {Logger} from "@kwaia/nodes";

const logger = new Logger();
logger.in.$.send("Hello World");
```

**Hello world (JS)**

```ecmascript 6
const Logger = require("@kwaia/nodes").Logger;

const logger = new Logger();
logger.in.$.send("Hello World");
```

All code samples in this document are also included in the npm package under 
`/examples`. You may run them using the command provided in the first line of
each code section.

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
entire graph. Tags are expected by node classes like `Tagger`, `SyncerBase`,
`Syncer`, `SequencerBase`, and `Sequencer`.

Tags usually take the value of a timestamp, a unique identifier or a 
combination of these.

```typescript
// explicit: sends in "foo" with tag "1"
node.in.$.send("foo", "1");

// implicit: sends in the output of StdIn, with the current timestamp as tag
new StdIn().out.$.connect(node.in.$);
```

Built-in nodes
--------------

Nodes comes with a number of built-in node types:

### Utilities

- `Logger`: Logs input to console.
- `Node`: Ad-hoc node defined by process callback and number of ports.
- `SuperNode`: Groups nodes into a single node.
- `Tagger`: Forwards input to output with the tag changed.

### Forwarders

Input values of these nodes are sent to the output unchanged.

- `Batcher`: Sends input to output in batches of a given size.
- `Noop`: Forwards input to output.
- `Sequencer`: Forwards input following a reference order.
- `Syncer`: Synchronizes input values from multiple ports into an array on a 
single port.

### Functional

Nodes that perform purely functional operations.

- `ChangeFilter`: Sends input to output when it's different from the last input.
- `Filter`: Outputs only those inputs that satisfy the specified filter callback.
- `Mapper`: Sends mapped input to output.
- `Reducer`: Outputs aggregated input values between changes in reference.

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


- `NodeBase`: General purpose 
- `SequencerBase`: Pre-processes input so it's following a reference order.
- `SyncerBase`: Pre-processes input so values with the same tag stay together.
- `TrackerBase`: Pre-processes input so last values are always accessible.

Ad-hoc nodes
------------

For prototyping purposes, and one-off solutions, we can create custom nodes 
without any subclassing. The ad-hoc `Node` class takes a callback, and two 
port counts on instantiation: one for input, one for output. Both counts 
default to 1.

The callback passed in will receive a lookup object of input values - indexed 
by port name, and the tag, and is not expected to return any value.

Once an ad-hoc node is created, its ports will be numbered, starting from 0. 
Accessing ports follows array index notation, eg. `node.in[0]`.

The example below re-creates `Noop` as an ad-hoc node.

```typescript
// node node_modules/@kwaia/nodes/examples/noop-ad-hoc
import {Logger, Node} from "@kwaia/nodes";

const noop = new Node((inputs) => noop.out[0].send(inputs[0]));
const logger = new Logger();

noop.out[0].connect(logger.in.$);
noop.in[0].send("foo"); // "foo"
```

Do not subclass `Node`, instead, subclass `NodeBase`, as illustrated in the 
next section.

Implementing a node class
-------------------------

To create a new node type, subclass `NodeBase`, or one of the other base 
classes: `TrackerBase`, `SequencerBase`, or `SyncerBase`. (More about these
below.)

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

The following example implements a plain `NodeBase` that adds two numeric inputs 
together.

```typescript
// node node_modules/@kwaia/nodes/examples/adder
import {InPort, Inputs, Logger, NodeBase, OutPort} from "@kwaia/nodes";

class Adder extends NodeBase {
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

### Using `SyncerBase`

When paths fork and join in a graph, synchronizing inputs becomes crucial. 
For custom nodes that rely on multiple inputs, Nodes provides `SyncerBase` 
as a foundation. The `#process()` method of `SyncerBase` always receives its 
`inputs` argument with *all* inputs that correspond to any given tag.

    `SyncerBase` is currently only recommended as a static node as cached
    input values may be purged on closing ports.

Nodes based on `SyncerBase` are nearly identical to those based on 
`TrackerBase`, except for the base class, and tags which are to be passed to 
`#send()`, as both rely on the presence of all inputs in `#process()`. 
`SyncerBase` outputs only once for each tag.

Notice how `Adder`, as a subclass of `SyncerBase`, outputs only twice in our 
example as opposed to four above.

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

### Using `SequencerBase`

With ordinary functions, we expect outputs to be produced in the same order as 
inputs go in. To make sure this happens regardless of input order, Nodes 
comes with `SequencerBase`.

    `SequencerBase` is currently only recommended as a static node as cached
    input values may be purged on closing ports.

Nodes based on `SequencerBase` are nearly identical to those based on 
`NodeBase`, except for the base class, the input port `ref`, (reference) and 
tags to be passed to `#send()`. `SequencerBase` outputs in the order 
specified by tags sent in on the reference input port, which is why it's 
important to have `ref` connected to the right source before sending to any 
of the other input ports.

Notice the extra inputs sent to `ref`, as well as the order of outputs near the
end of the example below, which implements `Adder` derived from 
`SequencerBase`. 

```typescript
// node node_modules/@kwaia/nodes/examples/adder-sequencer
import {InPort, Inputs, Logger, OutPort, SequencerBase} from "@kwaia/nodes";

class Adder extends SequencerBase {
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
// node node_modules/@kwaia/nodes/examples/super-node
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
subclass `NodeBase`.

Custom super-nodes have to:

1. create their own child nodes,
2. set up internal connections,
3. assign output ports, and
4. direct input values to child nodes' ports in `#process()`

In the case of super-node classes, `#process()` sends input values of the 
super-node to input ports of child nodes, instead of sending processed values
to output ports. This allows super-nodes to be based on either of the 
available base classes: `NodeBase`, `TrackerBase`, `SyncerBase`, and `SequencerBase`.

The following example does exactly the same as the ad-hoc version above, but 
as a super-node class in its own right.

```typescript
// node node_modules/@kwaia/nodes/examples/json-logger
import {InPort, Inputs, JsonStringifier, Logger, NodeBase} from "@kwaia/nodes";

class JsonLogger extends NodeBase {
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

- [ ] Additional source and sink nodes (eg. networking, filesystem).
- [ ] Connecting node ports to network ports.
- [ ] Trail: how inputs arrived at the current node.
- [ ] GraphML support: saving & restoring overall state of the graph.
- [ ] Warnings / errors on congestion in `SyncerBase` & `SequencerBase`.
- [ ] Error handling: error ports for built-in nodes.
- [ ] Visual graph snapshot: generating image of nodes and connections.
- [ ] Visual debugging: annotating graph with traffic statistics.
