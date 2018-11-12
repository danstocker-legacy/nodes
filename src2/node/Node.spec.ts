import {Node} from "./Node";

describe("Node", function () {
  class TestNode extends Node<{}, {}> {
    constructor() {
      super();
    }

    public send(): void {
      //
    }
  }

  describe("constructor", function () {
    it("should open ports", function () {
      const node = new TestNode();
      expect(node.svc.evt).toBeDefined();
    });
  });
});
