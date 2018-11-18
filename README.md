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

Nodes is a [Kwaia](http://kwaia.com) project, and is developed in 
[TypeScript](http://www.typescriptlang.org/).

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

### Atomic language nodes

TBD

### Utility nodes

TBD

### Standard library nodes

TBD

Implementing a node class
-------------------------

TBD

Ad-hoc super-nodes
------------------

TBD

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
import {
  Console, InPort, Inputs, Logger, map, Mapper, NodeBase
} from "@kwaia/nodes";

class JsonLogger extends NodeBase {
  public readonly in: {
    $: InPort<object>
  };
  private readonly stringifier: Mapper<any, string>;

  constructor() {
    super();
    const jsonStringifier = new Mapper(map.jsonStringify);
    const logger = new Logger();
    const con = new Console();
    this.stringifier = jsonStringifier;
    jsonStringifier.out.$.connect(logger.in.$);
    logger.out.log.connect(con.in.log);
    this.openInPort("$", new InPort(this));
  }

  protected process(inputs: Inputs, tag?: string): void {
    const value = inputs.get(this.in.$);
    this.stringifier.in.$.send(value, tag);
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
- [ ] Visual graph snapshot: generating image of nodes and connections.
- [ ] Visual debugging: annotating graph with traffic statistics.
