import {Noop} from "./Noop";

describe("Noop", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Noop<number>();
      expect(node.i.$).toBeDefined();
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
      node.send(node.i.$, 5, "1");
      expect(node.out.$.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
