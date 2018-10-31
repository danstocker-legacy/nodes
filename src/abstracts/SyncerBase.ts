import {INode, InPort, Inputs, NodeBase} from "../node";

type SyncCallback = (node: INode, inputs: Inputs, tag?: string) => Set<InPort<any>>;

/**
 * Pre-processes input so values with the same tag stay together.
 * TODO: Track cache size.
 */
export abstract class SyncerBase extends NodeBase {
  // subclasses must have access to these to handle failures
  protected readonly cachedInputSets: Map<string, Inputs>;
  protected readonly requiredPortSets: Map<string, Set<InPort<any>>>;

  private readonly syncCallback: SyncCallback;

  protected constructor(syncCallback: SyncCallback = (node: INode) => new Set(Object.values(node.in))) {
    super();
    this.cachedInputSets = new Map();
    this.requiredPortSets = new Map();
    this.syncCallback = syncCallback;
  }

  public send(inputs: Inputs, tag: string): void {
    const cachedInputSets = this.cachedInputSets;
    let cachedInputs = cachedInputSets.get(tag);
    if (!cachedInputs) {
      cachedInputs = new Map();
      cachedInputSets.set(tag, cachedInputs);
    }

    const requiredPortSets = this.requiredPortSets;
    let requiredPorts = requiredPortSets.get(tag);
    if (!requiredPorts) {
      // attempting to acquire required port set
      requiredPorts = this.syncCallback(this, cachedInputs, tag);
      requiredPortSets.set(tag, requiredPorts);
    }

    if (requiredPorts) {
      // associating input values with port and tag
      for (const [port, value] of inputs.entries()) {
        cachedInputs.set(port, value);
        requiredPorts.delete(port);
      }

      if (requiredPorts.size === 0) {
        // got all inputs for current tag
        cachedInputSets.delete(tag);
        requiredPortSets.delete(tag);
        this.process(cachedInputs, tag);
      }
    }
  }
}
