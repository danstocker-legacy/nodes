Cross Stream
============

Push event propagation along graph edges

With Cross Stream, you plan the flow of data and events like you would draw a 
graph. Cross Stream's API footprint is very small compared to something like
Rx.js, for instance, but is flexible enough to solve complex problems, from 
stream data processing to neural networks.

The basic unit of Cross Stream is the `Node`. You build the graph by connecting 
nodes, then feed data into the graph by invoking `Node#in` on relevant nodes.

A simple example:

```typescript
import {Logger, Noop} from "cross-stream";
let l = new Logger(),
    a = new Noop(),
    b = new Noop();
a.edge(b);
b.edge(l);
a.in("Hello World");
```

Supported Node types
--------------------

General purpose:
- `Noop`: forwards value synchronously
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
