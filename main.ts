#!/usr/bin/env node
import {Logger} from "./src/Logger";
import {Noop} from "./src/Noop";
import {Aggregator} from "./src/Aggregator";
import {Merger} from "./src/Merger";
import {Filter} from "./src/Filter";
import {Mapper} from "./src/Mapper";
import {Delayer} from "./src/Delayer";
import {Debouncer} from "./src/Debouncer";
import {Throttler} from "./src/Throttler";

let l = new Logger();

{
    console.log("Noop");
    let a = new Noop(),
        b = new Noop(),
        c = new Noop();
    a.edge(b, c);
    b.edge(l);
    c.edge(l);
    a.in("Hello World");
}

{
    console.log("Aggregator");
    let a = new Noop(),
        b = new Noop(),
        c = new Aggregator<number, number>((sum, next) => sum + (next || 0), 0);
    a.edge(c);
    b.edge(c);
    c.edge(l);
    a.in(2);
    b.in(3);
    b.in(4);
}

{
    console.log("Merger");
    let a = new Noop(),
        b = new Noop(),
        c = new Merger<number>();
    a.edge(c);
    b.edge(c);
    c.edge(l);
    a.in(2);
    b.in(3);
    b.in(4);
}

{
    console.log("Filter");
    let a = new Noop(),
        b = new Noop(),
        c = new Filter<number>(value => value <= 5 && value > 0);
    a.edge(c);
    b.edge(c);
    c.edge(l);
    a.in(10);
    b.in(5);
    a.in(4);
    b.in(-2);
}

{
    console.log("Mapper");
    let a = new Noop(),
        c = new Mapper<number, number>(value => value * 2);
    a.edge(c);
    c.edge(l);
    a.in(1);
    a.in(2);
    a.in(3);
}

{
    console.log("Delayer");
    let a = new Noop(),
        b = new Delayer(1000);
    a.edge(b);
    b.edge(l);
    a.in("Hello with 1s delay");
}

{
    console.log("Debouncer");
    let a = new Noop(),
        b = new Debouncer(1000);
    a.edge(b);
    b.edge(l);
    a.in(1);
    a.in(2);
    a.in(3);
    a.in(4);
}

{
    console.log("Throttler");
    let a = new Noop(),
        b = new Throttler(1000);
    a.edge(b);
    b.edge(l);
    setTimeout(() => a.in(1), 0);
    setTimeout(() => a.in(2), 600);
    setTimeout(() => a.in(3), 1200);
    setTimeout(() => a.in(4), 1800);
}
