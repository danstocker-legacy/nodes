import {Gate} from "./Gate";

describe("Gate", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Gate();
      expect(node.i.mul).toBeDefined();
      expect(node.o.d_val).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Gate<number>;

    beforeEach(function () {
      node = new Gate();
    });

    describe("when ref is truthy", function () {
      it("should forward value", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.mul, {d_val: 2, st_open: true}, "1");
        expect(node.o.d_val.send).toHaveBeenCalledWith(2, "1");
      });
    });

    describe("when ref is falsy", function () {
      it("should not forward value", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.mul, {d_val: 2, st_open: false}, "1");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });
    });
  });
});
