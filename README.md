Nodes
=====

Nodes is a reactive library for processing streaming data.

In Nodes, the basic processing unit is the *node*, which is similar to a 
function, in that it takes *inputs* and produces *outputs*. But instead of 
arguments and return value, it communicates through *ports*. A node may have 
any number of ports, but most nodes have one input and one output port. Ports
may be connected between nodes, forming a web, or graph, and defining the 
flow of data through the system.

Nodes comes with a set of pre-defined node classes, like Mapper, Filter, etc.
but the power of this library lies in its extensibility. Any (custom) node 
has two responsibilities: a) define a set of ports, and b) process and 
distribute inputs to outputs in a single override method.

Composition of nodes is also quite simple with the SuperNode. Any set of  
interacting nodes might be treated as a single node, provided that relevant  
input and output ports are assigned.

Programs written in Nodes are essentially graphs, (or more precisely,  
orchestrators of graphs) which are, by their nature, easy to visualize and  
diagnose.

Nodes is developed in TypeScript.

Nodes is a Kwaia project.

Implementing a node class
-------------------------

TBD

Creating an ad-hoc supernode
----------------------------

TBD

Implementing a supernode class
------------------------------

TBD

Debugging a Nodes program
-------------------------

TBD

Examples
--------

TBD

Planned features
----------------

- [ ] trail
- [ ] state snapshot
- [ ] restore from state snapshot
- [ ] visual graph snapshot
- [ ] visual debugging
