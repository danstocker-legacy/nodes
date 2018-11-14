import {Node} from "./Node";

describe("Node", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Node();
      expect(node.svc.evt).toBeDefined();
    });
  });
});
