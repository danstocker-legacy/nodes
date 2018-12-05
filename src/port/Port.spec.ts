import {IPort} from "./IPort";
import {Port} from "./Port";

describe("Port", function () {
  class TestPort<V> extends Port<V> {
    constructor(name: string, node: any) {
      super(name, node);
    }

    public connect(peer: IPort<V>, tag?: string): void {
      //
    }

    public send(value: V, tag?: string): void {
      //
    }
  }

  describe("constructor", function () {
    it("should initialize property 'name'", function () {
      const node = {};
      const port = new TestPort("foo", node);
      expect(port.name).toBe("foo");
    });

    it("should initialize property 'node'", function () {
      const node = {};
      const port = new TestPort("foo", node);
      expect(port.node).toBe(node);
    });
  });
});
