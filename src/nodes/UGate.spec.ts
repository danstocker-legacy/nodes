import {UGate} from "./UGate";

describe("UGate", function () {
  describe("constructor", function () {
    it("should add ports", function () {
      const node = new UGate();
      expect(node.i.i).toBeDefined();
      expect(node.o.d_val).toBeDefined();
    });
  });

  describe("#send()", function () {
    let node: UGate<number>;

    beforeEach(function () {
      node = new UGate();
    });

    describe("when 'st_open' is truthy", function () {
      it("should forward value", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.i, {d_val: 2, st_open: true}, "1");
        expect(node.o.d_val.send).toHaveBeenCalledWith(2, "1");
      });
    });

    describe("when 'st_open' is falsy", function () {
      it("should not forward value", function () {
        spyOn(node.o.d_val, "send");
        node.send(node.i.i, {d_val: 2, st_open: false}, "1");
        expect(node.o.d_val.send).not.toHaveBeenCalled();
      });
    });
  });
});
