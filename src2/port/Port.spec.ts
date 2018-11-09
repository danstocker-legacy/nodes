import {IAtomicNode} from "../node";
import {IPort} from "./IPort";
import {Port} from "./Port";

describe("Port", function () {
  class TestPort<T> extends Port<T> {
    constructor(name: string, node: IAtomicNode) {
      super(name, node);
    }

    public connect(peer: IPort<T>, tag?: string): void {
      //
    }

    public send(value: T, tag?: string): void {
      //
    }
  }

  describe("constructor", function () {
    it("should initialize property 'name'", function () {
      const node = <IAtomicNode> {};
      const port = new TestPort("foo", node);
      expect(port.name).toBe("foo");
    });

    it("should initialize property 'node'", function () {
      const node = <IAtomicNode> {};
      const port = new TestPort("foo", node);
      expect(port.node).toBe(node);
    });
  });
});
