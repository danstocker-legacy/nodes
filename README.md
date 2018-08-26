Cross Stream
============

Push event propagation along graph edges

With Cross Stream, you plan the flow of data and events like you would draw a 
graph. Cross Stream's API footprint is very small compared to something like
Rx.js for instance, but is flexible enough to solve complex problems, from 
stream data processing to neural networks.

The basic unit of Cross Stream is the `Node`. You build the graph by connecting 
nodes, then feed data into the graph by invoking `Node#in` on relevant nodes.

A simple example:

```typescript
import {Delayer, Logger, Throttler} from "cross-stream";
let delayer1 = new Delayer(1500),
    delayer2 = new Delayer(1000),
    delayer3 = new Delayer(500),
    throttler = new Throttler(500),
    logger = new Logger();
delayer1.edge(throttler);
delayer2.edge(throttler);
delayer3.edge(throttler);
throttler.edge(logger);
delayer1.in("Hello");
delayer2.in("World");
delayer3.in("!");
// output:
// [ '!', 'World' ]
// [ 'Hello' ]
```

For more examples, look in `src/examples`.

Bundled nodes
-------------

General purpose:
- `Noop`: forwards value synchronously
- `LineSplitter`: splits string into lines
- `Logger`: logs input to console
- `Stringifier`: converts input to string

Functional:
- `Aggregator`: aggregates values from multiple source nodes
- `Merger`: a kind of `Aggregator`, merges input values into an array
- `Filter`: forwards values selectively
- `Mapper`: forwards values with mapping

Timing:
- `Delayer`: forwards delayed
- `Debouncer`: forwards accumulated values with debouncing
- `Throttler`: forwards accumulated values with throttling

Input / Output:
- `StdIn`: outputs when `process.stdin` receives data
- `StdOut`: writes input to `process.stdout`
- `StdErr`: writes input to `process.stderr`