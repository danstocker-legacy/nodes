import {IAtomicNode} from "../node";
import {IPort} from "./IPort";
import {Port} from "./Port";

describe("Port", function () {
  class TestPort<T> extends Port<IAtomicNode<any>, T> {
    constructor(name: string, node: IAtomicNode<any>) {
      super(name, node);
    }

    public connect(peer: IPort<IAtomicNode<any>, T>, tag?: string): void {
      //
    }

    public send(value: T, tag?: string): void {
      //
    }
  }

  describe("constructor", function () {
    it("should initialize property 'name'", function () {
      const node = <IAtomicNode<any>> {};
      const port = new TestPort("foo", node);
      expect(port.name).toBe("foo");
    });

    it("should initialize property 'node'", function () {
      const node = <IAtomicNode<any>> {};
      const port = new TestPort("foo", node);
      expect(port.node).toBe(node);
    });
  });
});
