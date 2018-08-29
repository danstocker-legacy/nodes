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
   * Source nodes in order of connection.
   * TODO: Lookup for sources?
   */
  protected readonly sources: Array<Node<any, I>>;

  /**
   * Targets in order of connection.
   */
  protected readonly targets: Array<Node<O, any>>;

  /**
   * Lookup of target nodes indexed by node ID.
   */
  protected readonly targetsById: Object;

  constructor() {
    this.id = this.constructor['name'] + Node.nextId++;
    this.sources = [];
    this.targets = [];
    this.targetsById = {};
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
    const targetCount = targets.length;
    for (let i = 0; i < targetCount; i++) {
      const target = targets[i];
      target.in['source'] = this;
      target.in(value);
      target.in['source'] = undefined;
    }
  }

  /**
   * Creates unidirectional edges to specified nodes for propagation.
   */
  public edge(...nodes): void {
    const targetsById = this.targetsById;
    for (let i = 0; i < nodes.length; i++) {
      const target = nodes[i];
      const targetId = target.id;
      if (!targetsById[targetId]) {
        this.targets.push(target);
        this.targetsById[targetId] = target;
        target.sources.push(this);
      }
    }
  }
}