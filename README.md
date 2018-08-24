Edgeflow
========

Push event propagation along graph edges

With Edgeflow, you plan the flow of data and events like you would draw a 
graph. Edgeflow's API footprint is very small compared to something like Rx.js, 
for instance, but is flexible enough to solve complex problems, from stream 
data processing to neural networks.

The basic unit of Edgeflow is the `Node`. You build the graph by connecting 
nodes, then feed data into the graph by invoking `Node#in` on relevant nodes.

A simple example:

```typescript
import {Logger, Noop} from "edgeflow";
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

Functional:
- `Aggregator`: aggregates values from multiple source nodes
- `Filter`: forwards values selectively
- `Mapper`: forwards values with mapping

Timing:
- `Delayer`: forwards delayed
- `Debouncer`: forwards accumulated values with debouncing
- `Throttler`: forwards accumulated values with throttling
