import {Picker} from "./Picker";

describe("Picker", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new Picker();
      expect(node.i.sy).toBeDefined();
      expect(node.o.d_val).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: Picker<number>;

    beforeEach(function () {
      node = new Picker();
    });

    describe("when ref is truthy", function () {
      it("should forward value", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.sy, {d_val: 2, st_fwd: true}, "1");
        expect(node.o.d_val.send).toHaveBeenCalledWith(2, "1");
      });
    });

    describe("when ref is falsy", function () {
      it("should not forward value", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.sy, {d_val: 2, st_fwd: false}, "1");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });
    });
  });
});
