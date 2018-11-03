import {INode} from "../node";
import {InPort} from "./InPort";

describe("InPort", function () {
  class TestInPort<T> extends InPort<T> {
    constructor(name: string, node: INode) {
      super(name, node);
    }
  }

  describe("constructor", function () {
    it("should set property 'in'", function () {
      const node = <INode> {};
      const port = new TestInPort("foo", node);
      expect(port.in).toBe(true);
    });
  });
});
