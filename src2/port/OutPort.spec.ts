import {INode} from "../node";
import {OutPort} from "./OutPort";

describe("OutPort", function () {
  class TestOutPort<T> extends OutPort<T> {
    constructor(name: string, node: INode) {
      super(name, node);
    }
  }

  describe("constructor", function () {
    it("should set property 'in'", function () {
      const node = <INode> {};
      const port = new TestOutPort("foo", node);
      expect(port.out).toBe(true);
    });
  });
});
