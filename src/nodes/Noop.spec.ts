import {Noop} from "./Noop";

describe("Noop", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Noop<number>();
      expect(node.i.d_val).toBeDefined();
      expect(node.o.d_val).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Noop<number>;

    beforeEach(function () {
      node = new Noop();
    });

    it("should", function () {
      spyOn(node.o.d_val, "send");
      node.send(node.i.d_val, 5, "1");
      expect(node.o.d_val.send).toHaveBeenCalledWith(5, "1");
    });
  });
});
