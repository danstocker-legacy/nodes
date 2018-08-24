/**
 * Basic unit of graph of observables.
 */
export class Node {
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

    /**
     * Last output value set by node.
     */
    public value: any;

    constructor() {
        this.id = this.constructor['name'] + Node.nextId++;
        this.inputs = {};
        this.outputs = {};
        this.value = undefined;
    }

    /**
     * Sends value to current node.
     */
    public in(value: any): void {
    }

    /**
     * Sends specified value to all output nodes.
     */
    protected out(value: any): void {
        let outputs = this.outputs;
        this.value = value;
        for (let nodeId in outputs) {
            let node = outputs[nodeId];
            node.in(value);
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