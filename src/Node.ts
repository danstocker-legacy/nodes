/**
 * Basic unit of graph of observables.
 */
export class Node<I, O> {
    /**
     * Keeps track of issued identifiers.
     */
    private static nextId: number = 0;

    /**
     * Identifies node instance globally.
     */
    public readonly id: string;

    /**
     * Lookup of input nodes indexed by IDs.
     */
    protected readonly inputs: Object;

    /**
     * Lookup of output nodes indexed by IDs.
     */
    protected readonly outputs: Object;

    constructor() {
        this.id = this.constructor['name'] + Node.nextId++;
        this.inputs = {};
        this.outputs = {};
    }

    /**
     * Sends value to current node.
     */
    public in(value: I): void {
    }

    /**
     * Sends specified value to all output nodes.
     */
    protected out(value: O): void {
        let outputs = this.outputs;
        for (let nodeId in outputs) {
            let node = outputs[nodeId];
            node.in['node'] = this;
            node.in(value);
            node.in['node'] = undefined;
        }
    }

    /**
     * Creates unidirectional edges to specified nodes for propagation.
     */
    public edge(...nodes): void {
        for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            this.outputs[node.id] = node;
            node.inputs[this.id] = this;
        }
    }
}