import {IInPort, TInPorts, TOutPorts} from "../port";
import {AtomicNode} from "./AtomicNode";

describe("Node", function () {
  class TestNode extends AtomicNode {
    public readonly in: TInPorts<{
      "$": any
    }>;
    public readonly out: TOutPorts<{
      "$": any
    }>;

    constructor() {
      super();
    }

    public send<T>(port: IInPort<T>, input: T, tag?: string): void {
      //
    }
  }

  describe("constructor", function () {
    it("should initialize property 'in'", function () {
      const node = new TestNode();
      expect(node.in).toBeDefined();
    });

    it("should initialize property 'out'", function () {
      const node = new TestNode();
      expect(node.out).toBeDefined();
    });
  });
});
