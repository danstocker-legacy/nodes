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
   * Lookup of source nodes indexed by their IDs.
   */
  protected readonly sources: Object;

  /**
   * Lookup of target nodes indexed by IDs.
   */
  protected readonly targets: Object;

  constructor() {
    this.id = this.constructor['name'] + Node.nextId++;
    this.sources = {};
    this.targets = {};
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
    const targets = this.targets;
    for (let nodeId in targets) {
      const target = targets[nodeId];
      target.in['source'] = this;
      target.in(value);
      target.in['source'] = undefined;
    }
  }

  /**
   * Creates unidirectional edges to specified nodes for propagation.
   */
  public edge(...nodes): void {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      this.targets[node.id] = node;
      node.sources[this.id] = this;
    }
  }
}