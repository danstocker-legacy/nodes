#!/usr/bin/env node
import {Logger} from "./src/Logger";
import {Noop} from "./src/Noop";
import {Aggregator} from "./src/Aggregator";
import {Filter} from "./src/Filter";

console.log("Noop");
let a = new Noop(),
    b = new Noop(),
    c = new Noop(),
    l = new Logger();
a.edge(b, c);
b.edge(l);
c.edge(l);
a.in("Hello World");

console.log("Aggregator");
let d = new Noop(),
    e = new Noop(),
    f = new Aggregator<number, number>((sum, next) => sum + (next || 0), 0);
d.edge(f);
e.edge(f);
f.edge(l);
d.in(2);
e.in(3);
e.in(4);

console.log("Filter");
let g = new Noop(),
    h = new Noop(),
    i = new Filter<number>(value => value <= 5 && value > 0);
g.edge(i);
h.edge(i);
i.edge(l);
g.in(10);
h.in(5);
g.in(4);
h.in(-2);
