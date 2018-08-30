Cross Stream
============

Push event propagation along graph edges

With Cross Stream, you plan the flow of data as you would draw a directed 
graph. Cross Stream's API footprint is small, but it's flexible enough to solve 
complex problems, from streaming data processing to neural networks.

The basic unit of Cross Stream is the *node* (`Node`). A node behaves much 
like a function: it takes an *input*, and generates an *output*. The 
difference is, you may connect nodes in a declarative manner, (which ends up 
being your program) then feed in data into the whole graph through relevant 
input nodes or sources (eg. *stdin*).

A simple example that throttles asynchronous input into batches:

```typescript
import {Delayer, Logger, Throttler} from "cross-stream";
const delayer1 = new Delayer(1500);
const delayer2 = new Delayer(1000);
const delayer3 = new Delayer(500);
const throttler = new Throttler(500);
const logger = new Logger();
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
- `JsonStringifier`: converts structure input to string

Functional:
- `Merger`: merges input from multiple source nodes
- `Filter`: forwards values selectively
- `Mapper`: forwards values with mapping

Timing:
- `Delayer`: forwards delayed
- `Debouncer`: forwards accumulated values with debouncing
- `Interval`: emits at every interval
- `Throttler`: forwards accumulated values with throttling

Input / Output:
- `StdIn`: outputs when `process.stdin` receives data
- `StdOut`: writes input to `process.stdout`
- `StdErr`: writes input to `process.stderr`
