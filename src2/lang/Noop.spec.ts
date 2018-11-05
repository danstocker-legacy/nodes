import {Noop} from "./Noop";

describe("Noop", function () {
  describe("constructor", function () {
    it("should open ports", function () {
      const node = new Noop<number>();
      expect(node.in.$).toBeDefined();
      expect(node.out.$).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Noop<number>;

    beforeEach(function () {
      node = new Noop();
    });

    it("should", function () {
      spyOn(node.out.$, "send");
      node.send(node.in.$, 5, "1");
      expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
    });
  });
});