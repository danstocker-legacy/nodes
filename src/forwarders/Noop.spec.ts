import {Noop} from "./Noop";

describe("Noop", function () {
  describe("constructor", function () {
    it("should initialize ports", function () {
      const node = new Noop();
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#sendInput()", function () {
    let node: Noop<number>;

    beforeEach(function () {
      node = new Noop();
    });

    it("should forward input to output", function () {
      spyOn(node.out.$, "send");
      node.sendInput(node.in.$, 5, "1");
      expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
